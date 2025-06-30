import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
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
    async getAll({fechaInicio, fechaFin, estatus, pagina, sizePagina}){
        const pedidos = [];
        const filters = [];
        //always ignore delete 
        filters.push(where('estatus', '!=', estatusPedido.DELETE));
        if(estatus){
            filters.push(where('estatus','==', estatus));
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            pedidos.push({id: doc.id, ...doc.data()});
        })
        return pedidos;
    }

    async getById({id}){
        const ref = doc(this.firestoreDb, 'pedidos', id);
        const docSnap = await getDoc(ref);
        if(!docSnap.exists()){
            return null;
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