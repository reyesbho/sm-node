import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { config } from "dotenv";
config(); // Load environment variables from .env file
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

console.log('Firebase Config:', firebaseConfig); // Log the configuration for debugging
const firebase = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebase);

const ref = collection(firestoreDb, 'products');

export class ProductModel {
    static async getAll ({tag}) {
        const products = [];
        let querySnapshot;
        if (tag) {
            const q = query(ref, where('tag', '==', tag));
            querySnapshot = await getDocs(q);    
        }else{
            querySnapshot = await getDocs(ref); 
        }

        querySnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
        return products;
    }

    static async getById ({id}) {
        const ref = doc(firestoreDb, 'products', id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null; // Product not found
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

    static async create (inputProduct) {
        const doc = await addDoc(ref, inputProduct);
        return this.getById({id: doc.id}); 
    }   

    static async delete ({id}) {
        const ref = doc(firestoreDb, 'products', id);
        const docSnap = await deleteDoc(ref);
        return true; // Product deleted successfully
    }

    static async update ({id, ...inputProduct}) {
        const ref = doc(firestoreDb, 'products', id);
        await updateDoc(ref, inputProduct);
        const updatedProduct = await this.getById({id});
        return updatedProduct; // Return the updated product
    }

}