import { addDoc, collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { Category } from "../../schemas/category.js";

export class CategoryModel {
    private firestoreDb: Firestore;
    private refCollection: CollectionReference;
    private catalog = 'categories';
    constructor({ firestoreDb }: { firestoreDb: Firestore }) {
        this.firestoreDb = firestoreDb;
        this.refCollection = collection(this.firestoreDb, this.catalog);
    }

    async getAll() {
        const categories: Category[] = [];
        const q = query(this.refCollection);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            const data = doc.data() as Omit<Category, 'id'>;
            categories.push({ id: doc.id, ...data });
        })
        return categories;
    }

    async getById({ id }: { id: string }): Promise<Category | null> {
        const ref = doc(this.firestoreDb, this.catalog, id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return null;
        }
        const data = docSnap.data() as Omit<Category, 'id'>;
        return { id: docSnap.id, ...data };
    }

    async create(inputCategory: Partial<Category>): Promise<Category | null> {
        const docRef = doc(this.refCollection, inputCategory.id);
        await setDoc(docRef, inputCategory);
        return { ...inputCategory} as Category;
    }

    async delete({id}:{id:string}){
        try {
            await deleteDoc(doc(this.firestoreDb, this.catalog, id));
            return true;
        } catch (error) {
            return false;
        }   
    }
}