import { addDoc, collection, CollectionReference, doc, Firestore, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, Timestamp, updateDoc, where } from "firebase/firestore";
import { EstatusPedido, Pedido } from "../../schemas/pedido.js";


interface PedidosSearch {
    fechaInicio?: string,
    fechaFin?: string,
    estatus?: EstatusPedido,
    cursorFechaCreacion?: string,
    pageSize?: number
}

export interface PedidosResponse {
    pedidos: Pedido[],
    nextCursor: string,
    hasMore: boolean,
    total: number
}

export class PedidoModel {
    private firestoreDb: Firestore;
    private refCollection: CollectionReference;
    constructor({ firestoreDb }: { firestoreDb: Firestore }) {
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(firestoreDb, 'pedidos');
    }

    /**busqueda de pedidos por
     * fecha_ini
     * fecha_fin
     * estatus
     * pagina
     * tamañoPagina
     *  **/
    async getAll({
        fechaInicio,
        fechaFin,
        estatus,
        cursorFechaCreacion,
        pageSize = 10
    }: PedidosSearch): Promise<PedidosResponse> {

        console.log(
        fechaInicio,
        fechaFin,
        estatus,
        cursorFechaCreacion,pageSize)
        const filters: QueryConstraint[] = [];
        const realLimit = pageSize + 1;

        // 🔒 ESTATUS (query estable)
        if (typeof estatus === 'string') {
            filters.push(where('estatus', '==', estatus));
        } else {
            filters.push(where('estatus', '!=', 'DELETE'));
        }

        // 🔒 FECHA INICIO
        if (typeof fechaInicio === 'string') {
            const [day, month, year] = fechaInicio.split('-');
            const date = new Date(+year, +month - 1, +day);
            date.setHours(0, 0, 0, 0);
            filters.push(where('fechaEntrega', '>=', date));
        }

        // 🔒 FECHA FIN
        if (typeof fechaFin === 'string') {
            const [day, month, year] = fechaFin.split('-');
            const date = new Date(+year, +month - 1, +day);
            date.setHours(23, 59, 59, 999);
            filters.push(where('fechaEntrega', '<=', date));
        }

        // 🔒 PAGINACIÓN SEGURA
        let cursorSnap = null;

        if (cursorFechaCreacion) {
            const cursorQuery = query(
                this.refCollection,
                orderBy('estatus'),
                orderBy('fechaCreacion'),
                where('fechaCreacion', '==', Timestamp.fromDate(new Date(cursorFechaCreacion))),
                limit(1)
            );

            const snap = await getDocs(cursorQuery);
            cursorSnap = snap.docs[0] ?? null;
        }

        console.log('ANTES getDocs');

        const q = query(
            this.refCollection,
            ...filters,
            orderBy('estatus'),
            orderBy('fechaCreacion'),
            ...(cursorSnap ? [startAfter(cursorSnap)] : []),
            limit(realLimit)
        );

        const querySnapshot = await getDocs(q);

        console.log('DESPUÉS getDocs');

        // 🔒 RESULTADOS
        const sliceDocs = querySnapshot.docs.slice(0, pageSize);

        const pedidos = sliceDocs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Pedido, 'id'>)
        }));

        // 🔒 CURSOR NUEVO
        const lastDoc = sliceDocs[sliceDocs.length - 1];
        const nextCursor = lastDoc
            ? lastDoc.data().fechaCreacion.toDate().toISOString()
            : null;

        return {
            pedidos,
            nextCursor,
            hasMore: querySnapshot.size > pageSize,
            total: querySnapshot.size
        };
    }


    async getById({ id }: { id: string }): Promise<Pedido | null> {
        const ref = doc(this.firestoreDb, 'pedidos', id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null;
        }
        const data = docSnap.data() as Omit<Pedido, 'id'>;
        return { id: docSnap.id, ...data };
    }


    async create(inputPedido: Partial<Pedido>) {
        const pedido = { ...inputPedido };
        const doc = await addDoc(this.refCollection, pedido);
        return this.getById({ id: doc.id });
    }

    async update(inputPedido: Pedido) {
        const ref = doc(this.firestoreDb, 'pedidos', inputPedido.id);
        const pedidoAux: Pedido = { ...inputPedido };
        const today = new Date();
        pedidoAux.fechaActualizacion = { seconds: today.getSeconds(), nanoseconds: today.getTime() }
        await updateDoc(ref, { ...pedidoAux });
        const updatedPedido = await this.getById({ id: pedidoAux.id });
        return updatedPedido;
    }

    async delete({ id }: { id: string }) {
        const pedido = await this.getById({ id });
        if (!pedido) {
            return false;
        }
        await this.update({ ...pedido, estatus: 'DELETE' });
        return true;
    }
}