import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";


export class ProductModel {

    constructor({firestoreDb}){
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(this.firestoreDb, 'products');
    }


     async getAll ({tag, estatus}) {
        
        const products = [];
        const filters = []
        if (tag) {
            filters.push(where('tag', '==', tag));
        }
        if(estatus){
            filters.push(where('estatus', '==', (estatus=='ACTIVO' ? true : false)))
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);    
        querySnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
        return products;
    }

     async getById ({id}) {
        const ref = doc(this.firestoreDb, 'products', id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null; // Product not found
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

     async create (inputProduct) {
        const doc = await addDoc(this.refCollection, inputProduct);
        return this.getById({id: doc.id}); 
    }   

     async delete ({id}) {
        const product = await this.getById({id});
        if (!product) {
            return false; // Product not found
        }
        await this.update({id, estatus: false}); 
        return true; 
    }

     async update ({id, ...inputProduct}) {
        const ref = doc(this.firestoreDb, 'products', id);
        await updateDoc(ref, inputProduct);
        const updatedProduct = await this.getById({id});
        return updatedProduct; // Return the updated product
    }

}