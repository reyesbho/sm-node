import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ErrorCodeFirebase } from "../../utils/utils.js";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

export class UserModel{
    constructor({auth, firestoreDb, authAdmin}){
        this.auth = auth;
        this.firestoreDb = firestoreDb;
        this.authAdmin = authAdmin;
        this.refCollection = collection(firestoreDb, 'usuario');
    }


    async createUserCatalog({user}){
        return await setDoc(doc(this.firestoreDb, 'usuario', user.id), {email:user.email});
    }

    async create({inputUser}){
        const {email, password} = inputUser;
        try {
            const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
            if(!userCredentials){
                return false;
            }
            const {uid} = userCredentials.user;
            await this.createUserCatalog({user: {id: uid, email}});
            return {id: uid, email};
        } catch (error) {
            if(error.code === ErrorCodeFirebase.EMAIL_EXIST)
                throw new Error('User already exists');
        }
    }

    async delete({ uid }) {
        try {
          await deleteDoc(doc(this.firestoreDb, "usuario", uid));
      
          await this.authAdmin.deleteUser(uid);
      
          return true;
        } catch (error) {
          return false;
        }
      }

    async login ({inputUser}){
        const {email, password} = inputUser;
        try{
            const login = await signInWithEmailAndPassword(this.auth, email, password);
            if(!login){
                return false;
            }
            return login.user;
        }catch(error){
            return false;
        }
        
    }

    async logout (){
        await signOut(this.auth).then(() => {
            return true;
        }).catch((error) => {
            return false;
        });
    }

}