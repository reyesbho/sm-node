import e from "express";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { GeneralCompanyModel } from "./GeneralCompany.js";


export class ProductModel extends GeneralCompanyModel {

    constructor({ firestoreDb }) {
        super();
        this.firestoreDb = firestoreDb;
        this.catalogName = 'productos';
    }

     async getAll ({tag, estatus, idCompany}) {
        const products = [];
        const filters = []
        if (tag) {
            filters.push(where('tag', '==', tag));
        }
        if(estatus !== undefined && estatus !== null) {
            filters.push(where('estatus', '==', (estatus ? true : false)));
        }
        const q = query(this.getRefCollection(idCompany), ...filters);
        const querySnapshot = await getDocs(q);    
        querySnapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
        return products;
    }

     async getById ({id, idCompany}) {
        const ref = this.getRefDoc(idCompany, id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return false;
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

     async create ({inputProduct, idCompany}) {
        const doc = await addDoc(this.getRefCollection(idCompany), inputProduct);
        return this.getById({id: doc.id, idCompany}); 
    }   

     async delete ({id, idCompany}) {
        const product = await this.getById({id, idCompany});
        if (!product) {
            return false;
        }
        await deleteDoc(this.getRefDoc(idCompany, id));
        return true; 
    }

     async update ({id, idCompany, ...inputProduct}) {
        const ref = this.getRefDoc(idCompany, id);
        await updateDoc(ref, inputProduct);
        const updatedProduct = await this.getById({id, idCompany});
        return updatedProduct; 
    }

     async updateState({id}) {
        const producto = await this.getById({id, idCompany});
        if (!producto) {
            return false; 
        }
        await this.update({id, estatus: !producto.estatus}); 
        return true; 
    }
}