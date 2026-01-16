import { addDoc, collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, query, QueryConstraint, updateDoc, where } from "firebase/firestore";
import { Producto } from "../../schemas/product.js";


export class ProductModel {
    private firestoreDb: Firestore;
    private refCollection: CollectionReference;
    constructor({ firestoreDb }: { firestoreDb: Firestore }) {
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(this.firestoreDb, 'products');
    }

    async getAll({ tag, estatus }: { tag: string | undefined, estatus: string | undefined }): Promise<Producto[]> {

        const products: Producto[] = [];
        const filters:QueryConstraint[] = []
        if (tag) {
            filters.push(where('tag', '==', tag));
        }
        if (estatus !== undefined && estatus !== null) {
            filters.push(where('estatus', '==', (estatus ? true : false)));
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            const data = doc.data() as Omit<Producto, 'id'>;
            products.push({ id: doc.id, ...data });
        });
        return products;
    }

    async getById({ id }: { id: string }): Promise<Producto | null> {
        const ref = doc(this.firestoreDb, 'products', id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null;
        }
        const data = docSnap.data() as Omit<Producto, 'id'>;
        return { id: docSnap.id, ...data };
    }

    async create(inputProduct: Partial<Producto>): Promise<Producto | null> {
        const doc = await addDoc(this.refCollection, inputProduct);
        return this.getById({ id: doc.id });
    }

    async delete({ id }: { id: string }): Promise<boolean> {
        const product = await this.getById({ id });
        if (!product) {
            return false;
        }
        await deleteDoc(doc(this.firestoreDb, 'products', id));
        return true;
    }

    async update({id = '', ...producto}: Partial<Producto>): Promise<Producto | null> {
        const ref = doc(this.firestoreDb, 'products', id);
        await updateDoc(ref, { ...producto });
        const updatedProduct = await this.getById({ id });
        return updatedProduct;
    }

}