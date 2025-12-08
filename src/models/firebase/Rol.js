import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export class RolModel {

    constructor({ firestoreDb }) {
        this.firestoreDb = firestoreDb;
        this.nameCatalog = 'roles';
        this.refCollection = collection(this.firestoreDb, this.nameCatalog);
        
    }

    async getAll() {
        const roles = [];
        const q = query(this.refCollection);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            roles.push({ id: doc.id, ...doc.data() });
        });
        return roles;
    }

    async getByClave({clave}){
        const roles = [];
        if(!clave){
            return null;
        }
        const q = query(this.refCollection, where('clave', '==', clave));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            roles.push({ id: doc.id, ...doc.data() });
        });
        return (roles.length >  0 ? roles[0] : []);
    }

    async getById({ id }) {
        const ref = doc(this.firestoreDb, this.nameCatalog, id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return false;
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

    async create({ inputRol }) {
        const rol = { ...inputRol };
        const doc = await addDoc(this.refCollection, rol);
        return this.getById({ id: doc.id });
    }

    async delete({ id }) {
        const rol = await this.getById({ id });
        if (!rol) {
            return false;
        }
        await deleteDoc(doc(this.firestoreDb, this.nameCatalog, id));
        return true;
    }

    async update({ id, ...inputRol }) {
        const ref = doc(this.firestoreDb, this.nameCatalog, id);
        await updateDoc(ref, inputRol);
        const updatedRol = await this.getById({ id });
        return updatedRol;
    }
}