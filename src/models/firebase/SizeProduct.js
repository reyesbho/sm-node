import { addDoc, collection,  doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";


export class SizeProductModel {
    constructor({firestoreDb}){
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(firestoreDb, 'sizes');
    }

     async getAll({tag, estatus}){
        const sizes = [];
        const filters = [];
        if (tag) {
            filters.push(where('tags', 'array-contains', tag));
        } 
        if(estatus){
            filters.push(where('estatus', '==', (estatus == 'ACTIVO' ? true : false)));
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);    
        querySnapshot.forEach(doc => {
            sizes.push({ id: doc.id, ...doc.data() });
        });
        return sizes;
    }

     async getById({id}) {
        const ref = doc(this.firestoreDb, 'sizes', id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null; // Size not found
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

     async create(inputSize) {
        const doc = await addDoc(this.refCollection, inputSize);
        return this.getById({id: doc.id});
    }

     async updateState({id}) {
        const size = await this.getById({id});
        if (!size) {
            return false; // Size not found
        }
        await this.update({id, estatus: !size.estatus}); 
        return true; 
    }

     async update({id, ...inputSize}) {
        const ref = doc(this.firestoreDb, 'sizes', id);
        await updateDoc(ref, inputSize);
        return this.getById({id});
    }
}