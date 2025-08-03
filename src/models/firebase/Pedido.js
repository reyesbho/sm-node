import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { estatusPedido } from "../../utils/utils.js";

export class PedidoModel{
    constructor({firestoreDb}){
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
    async getAll({fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize}){
        const filters = [];
        const realLimit = pageSize + 1;
        const offsetMillis = 6 * 60 * 60 * 1000; // para UTC-6
        //always ignore delete 
        filters.push(where('estatus', '!=', estatusPedido.DELETE));
        if(estatus && estatus != 'ALL'){
            filters.push(where('estatus','==', estatus));
        }
        
        if (fechaInicio) {
            const [day, month, year] = fechaInicio.split('-');
            const fechaInicioDate = new Date(Number(year), Number(month) - 1, Number(day));
            fechaInicioDate.setHours(0, 0, 0, 0);
            filters.push(where('fechaEntrega', '>=', fechaInicioDate));
        }

        if (fechaFin) {
            const [day, month, year] = fechaFin.split('-');
            const fechaFinDate = new Date(Number(year), Number(month) - 1, Number(day));
             // Establecer hora al final del día
            fechaFinDate.setHours(23, 59, 59, 999);
            filters.push(where('fechaEntrega', '<=', fechaFinDate));
        }
        
        let q = query(this.refCollection,
                      ...filters,
                      orderBy('fechaCreacion'),
                      ...(cursorFechaCreacion ? [startAfter(new Date(cursorFechaCreacion))] : []),
                      limit(realLimit));

        const querySnapshot = await getDocs(q);
        const sliceDocs = querySnapshot.docs.slice(0, pageSize);
        const pedidos = sliceDocs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Cursor para la siguiente página (fecha del último doc)
        const lastDoc = sliceDocs[sliceDocs.length - 1];
        const nextCursor = lastDoc ? lastDoc.data().fechaCreacion.toDate().toISOString() : null;

        return {
            pedidos,
            nextCursor, // úsalo como cursorFechaEntrega para la siguiente página
            hasMore: querySnapshot.size >= pageSize,
            total: querySnapshot.size
        };
    }

    async getById({id}){
        const ref = doc(this.firestoreDb, 'pedidos', id);
        const docSnap = await getDoc(ref);
        if(!docSnap.exists()){
            return false;
        }
        const data = docSnap.data();
        return {id: docSnap.id, ...data};
    }


    async create({inputPedido}){
        const pedido = {...inputPedido};
        const doc = await addDoc(this.refCollection, pedido);
        return this.getById({id : doc.id});        
    }

    async update({id, ...inputPedido}){
        console.log('update', id, inputPedido);
        const ref = doc(this.firestoreDb, 'pedidos', id);
        const pedidoAux= {...inputPedido};
        pedidoAux.fechaActualizacion = new Date();
        await updateDoc(ref, pedidoAux);
        const updatedPedido = await this.getById({id});
        return updatedPedido;
    }

    async delete({id}){
        const pedido = await this.getById({id});
        if(!pedido){
            return false;
        }
        await this.update({id, estatus: estatusPedido.DELETE});
        return true;
    }
}