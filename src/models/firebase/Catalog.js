import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { GeneralModel } from "./General.js";


export class CatalogModel extends GeneralModel{

    constructor({ firestoreDb }) {
        super();
        this.firestoreDb = firestoreDb;
        this.catalogName = 'catalogos';
    }

     async getAll ({estatus}) {
        const products = [];
        const filters = [];
        if(estatus !== undefined && estatus !== null) {
            filters.push(where('estatus', '==', (estatus ? true : false)));
        }
        const q = query(this.getRefCollection(), ...filters);
        const querySnapshot = await getDocs(q);    
        querySnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
        return products;
    }

     async getById ({id}) {
        const ref = this.getRefDoc(id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return false;
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }
}