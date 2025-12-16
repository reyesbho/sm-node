import { collection, doc } from "firebase/firestore";
import { GeneralModel } from "./General.js";

export class GeneralCompanyModel extends GeneralModel {

    getRefCollection(idCompany) {
        const collectionName = `companias/${idCompany}/${this.catalogName}`;
        return collection(this.firestoreDb, collectionName);
    }

    getRefDoc(idCompany, id) {
        return doc(this.firestoreDb, `companias/${idCompany}/${this.catalogName}/${id}`);
    }
}