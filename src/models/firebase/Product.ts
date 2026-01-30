import { addDoc, collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, query, QueryConstraint, updateDoc, where } from "firebase/firestore";
import { ProductoDB } from "../../schemas/product.js";


export class ProductModel {
    private firestoreDb: Firestore;
    private refCollection: CollectionReference;
    private catalog = 'productos';
    constructor({ firestoreDb }: { firestoreDb: Firestore }) {
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(this.firestoreDb, this.catalog);
    }

    async getAll({ tag, estatus, category }: { tag: string | undefined, estatus: string | undefined, category: string | undefined }): Promise<ProductoDB[]> {

        const products: ProductoDB[] = [];
        const filters: QueryConstraint[] = []
        if (tag) {
            filters.push(where('tag', '==', tag));
        }
        if (estatus !== undefined && estatus !== null) {
            filters.push(where('estatus', '==', (estatus ? true : false)));
        }
        if (category !== undefined && category !== null) {
            filters.push(where('category', '==', category));
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            const data = doc.data() as Omit<ProductoDB, 'id'>;
            products.push({ id: doc.id, ...data });
        });
        return products;
    }

    async getById({ id }: { id: string }): Promise<ProductoDB | null> {
        const ref = doc(this.firestoreDb, this.catalog, id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null;
        }
        const data = docSnap.data() as Omit<ProductoDB, 'id'>;
        return { id: docSnap.id, ...data };
    }

    async create(inputProduct: Partial<ProductoDB>): Promise<ProductoDB | null> {
        const doc = await addDoc(this.refCollection, inputProduct);
        return { id: doc.id, ...inputProduct } as ProductoDB;
    }

    async delete({ id }: { id: string }): Promise<boolean> {
        try {
            await deleteDoc(doc(this.firestoreDb, this.catalog, id));
            return true;
        } catch (error) {
            return false;
        }
    }

    async update(id: string,producto: Partial<ProductoDB>): Promise<ProductoDB | null> {
        const ref = doc(this.firestoreDb, this.catalog, id);
        await updateDoc(ref, { ...producto });
        const updatedProduct = await this.getById({id});
        return updatedProduct;
    }

}