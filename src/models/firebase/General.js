import { collection, doc } from "firebase/firestore";

export class GeneralModel {
    constructor() {
        this.firestoreDb = null;
        this.catalogName = '';
    }   

    getRefCollection() {
        const collectionName = this.catalogName
        return collection(this.firestoreDb, collectionName);
    }

    getRefDoc(id) {  
        return doc(this.firestoreDb, `${this.catalogName}/${id}`);
    }

}