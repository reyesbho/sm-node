import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export class CompanyModel {
    constructor({firestoreDb}){
        this.firestoreDb = firestoreDb;
        this.collectionName = 'companias';
        this.refCollection = collection(this.firestoreDb, this.collectionName);
    }

    async getAll({estatus, user}){
        const companys = [];
        const filters = [];
        if(estatus != undefined){
            filters.push(where('estatus', '==', estatus));
        }
        if(user != undefined){
            filters.push(where('user.email', '==', user));
        }
        const q = query(this.refCollection, ...filters);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            companys.push({id: doc.id, ...doc.data()});
        })
        return companys;
    }

    async getById({id}){
        const ref = doc(this.firestoreDb, this.collectionName, id);
        const docSnap =  await getDoc(ref);
        if(!docSnap.exists()){
            return false;
        }
        const data = docSnap.data();
        return {id: docSnap.id, ...data};
    }

    async create({inputCompany}){
        const company = {...inputCompany};
        const doc = await addDoc(this.refCollection, company);
        return this.getById({id: doc.id});
    }

    async delete({id}){
        const company = await this.getById({id});
        if(!company){
            return false;
        }
        try{
            await deleteDoc(doc(this.firestoreDb, this.collectionName, id));   
        }catch{
            return false;
        }
        return true;
    }

    async update({id, ...inputCompany}){
        const ref = doc(this.firestoreDb, this.collectionName, id);
        await updateDoc(ref, inputCompany);
        const updateCompany = await this.getById({id});
        return updateCompany;
    }

    async updateStatus({id}){
        const company = await this.getById({id});
        if(!company){
            return false;
        }
        await this.update({id, estatus:!company.estatus});
        return true;
    }
}