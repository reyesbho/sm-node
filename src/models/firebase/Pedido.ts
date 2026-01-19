import { addDoc, collection, CollectionReference, deleteDoc, doc, Firestore, getCountFromServer, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, Timestamp, updateDoc, where } from "firebase/firestore";
import { EstatusPedido, Pedido } from "../../schemas/pedido.js";
import { Resume } from "../../types/resume.js";


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
    totalDocs: number,
    totalPages: number,
    pageSize: number
}

export class PedidoModel {
    private firestoreDb: Firestore;
    private refCollection: CollectionReference;
    private catalog = 'pedidos';
    constructor({ firestoreDb }: { firestoreDb: Firestore }) {
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(firestoreDb, this.catalog);
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

        const filters: QueryConstraint[] = [];
        const realLimit = pageSize + 1;

        // 🔒 ESTATUS
        if (typeof estatus === "string") {
            filters.push(where("estatus", "==", estatus));
        } else {
            filters.push(where("estatus", "!=", "DELETE"));
        }

        // 🔒 FECHA INICIO
        if (typeof fechaInicio === "string") {
            const [day, month, year] = fechaInicio.split("-");
            const date = new Date(+year, +month - 1, +day);
            date.setHours(0, 0, 0, 0);
            filters.push(where("fechaEntrega", ">=", date));
        }

        // 🔒 FECHA FIN
        if (typeof fechaFin === "string") {
            const [day, month, year] = fechaFin.split("-");
            const date = new Date(+year, +month - 1, +day);
            date.setHours(23, 59, 59, 999);
            filters.push(where("fechaEntrega", "<=", date));
        }

        // 🔒 CURSOR
        let cursorSnap = null;

        if (cursorFechaCreacion) {
            const cursorQuery = query(
                this.refCollection,
                orderBy("estatus"),
                orderBy("fechaCreacion"),
                where(
                    "fechaCreacion",
                    "==",
                    Timestamp.fromDate(new Date(cursorFechaCreacion))
                ),
                limit(1)
            );

            const snap = await getDocs(cursorQuery);
            cursorSnap = snap.docs[0] ?? null;
        }

        // 🔒 QUERY PRINCIPAL
        const q = query(
            this.refCollection,
            ...filters,
            orderBy("estatus"),
            orderBy("fechaCreacion"),
            ...(cursorSnap ? [startAfter(cursorSnap)] : []),
            limit(realLimit)
        );

        // 🚀 EJECUTAR QUERIES EN PARALELO
        const [querySnapshot, countSnapshot] = await Promise.all([
            getDocs(q),
            getCountFromServer(
                query(this.refCollection, ...filters)
            )
        ]);

        // 🔒 RESULTADOS
        const sliceDocs = querySnapshot.docs.slice(0, pageSize);

        const pedidos = sliceDocs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Pedido, "id">)
        }));

        // 🔒 NUEVO CURSOR
        const lastDoc = sliceDocs[sliceDocs.length - 1];
        const nextCursor = lastDoc
            ? lastDoc.data().fechaCreacion.toDate().toISOString()
            : null;

        // 🔢 TOTALES
        const totalDocs = countSnapshot.data().count;
        const totalPages = Math.ceil(totalDocs / pageSize);

        return {
            pedidos,
            nextCursor,
            hasMore: querySnapshot.size > pageSize,
            totalDocs,
            totalPages,
            pageSize
        };
    }


    async resume(fechaInicio?: string, fechaFin?: string,): Promise<Resume> {
        let dateInit = new Date();
        let dateEnd = new Date();

        if (typeof fechaInicio === 'string') {
            const [day, month, year] = fechaInicio.split('-');
            dateInit = new Date(+year, +month - 1, +day);
            dateInit.setHours(0, 0, 0, 0);
        } else {
            dateInit.setHours(0, 0, 0, 0);
            dateInit.setDate(1);
        }

        // 🔒 FECHA FIN
        if (typeof fechaFin === 'string') {
            const [day, month, year] = fechaFin.split('-');
            const date = new Date(+year, +month - 1, +day);
            dateEnd.setHours(23, 59, 59, 999);
        } else {
            const now = new Date();
            dateEnd.setHours(23, 59, 59, 999);
            dateEnd.setMonth(now.getMonth() + 1)
            dateEnd.setDate(0);
        }
        const filters: QueryConstraint[] = [];
        filters.push(where('fechaEntrega', '>=', dateInit));
        filters.push(where('fechaEntrega', '<=', dateEnd));

        const q = query(
            this.refCollection,
            ...filters
        );

        const querySnapshot = await getDocs(q);
        const pedidos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Pedido, 'id'>)
        }));
        const resume: Resume = {
            cancelados: 0,
            pedidosTotales: pedidos.length,
            porHacer: 0,
            entregados: 0,
            totalDelMes: 0,
            totalCancelado: 0,
            totalEcho: 0,
            totalPorHacer: 0
        }

        pedidos.forEach((pedido) => {
            switch (pedido.estatus) {
                case 'TODO':
                    resume.porHacer++;
                    resume.totalDelMes += pedido.total;
                    resume.totalPorHacer += pedido.total;
                    break;
                case 'DONE':
                    resume.entregados++;
                    resume.totalDelMes = pedido.total;
                    resume.totalEcho += pedido.total;
                    break;
                case 'CANCELED':
                    resume.cancelados++;
                    resume.totalCancelado += pedido.total;
                    break;
            }
        })

        return resume;

    }

    async getById({ id }: { id: string }): Promise<Pedido | null> {
        const ref = doc(this.firestoreDb, this.catalog, id);
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
        return { id: doc.id, ...pedido }
    }

    async update(inputPedido: Pedido) {
        const ref = doc(this.firestoreDb, this.catalog, inputPedido.id);
        const pedidoAux: Pedido = { ...inputPedido };
        const today = new Date();
        pedidoAux.fechaActualizacion = { seconds: today.getSeconds(), nanoseconds: today.getTime() }
        await updateDoc(ref, { ...pedidoAux });
        const updatedPedido = await this.getById({ id: pedidoAux.id });
        return updatedPedido;
    }

    async delete({ id }: { id: string }) {
        try {
            await deleteDoc(doc(this.firestoreDb, this.catalog, id));
            return true;
        } catch (error) {
            return false;
        }
    }
}