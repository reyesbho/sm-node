import { collection } from "firebase/firestore";

export class GeneralCompanyModel {

    constructor() {
        this.firestoreDb = null;        
        this.catalogName = '';
    }

    getRefCollection(idCompany) {
        const collectionName = `companias/${idCompany}/${this.catalogName}`;
        return collection(this.firestoreDb, collectionName);
    }

    getRefDoc(idCompany, id) {
    return doc(this.firestoreDb, `companias/${idCompany}/${this.catalogName}/${id}`);
}
}