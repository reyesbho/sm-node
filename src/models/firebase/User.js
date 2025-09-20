import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ErrorCodeFirebase } from "../../utils/utils.js";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export class UserModel{
    constructor({auth, firestoreDb, authAdmin}){
        this.auth = auth;
        this.firestoreDb = firestoreDb;
        this.authAdmin = authAdmin;
        this.collection = 'usuario';
        this.refCollection = collection(firestoreDb, this.collection);
    }


    async getById ({id}) {
        const ref = doc(this.firestoreDb, this.collection, id);
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            return false;
        }
        const data = docSnap.data();
        return { id: docSnap.id, ...data };
    }

    async createUserCatalog({user, rol}){
        await setDoc(doc(this.firestoreDb, this.collection, user.id), {email:user.email, rol: rol});
        const newUserCatalog = await this.getById({id: user.id});
        return newUserCatalog;
    }

    async create({inputUser, rol}){
        console.log("UserModel", rol);
        const {email, password} = inputUser;
        try {
            const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
            if(!userCredentials){
                return false;
            }
            const {uid} = userCredentials.user;
            const newUser = await this.createUserCatalog({user: {id: uid, email}, rol});
            return newUser;
        } catch (error) {
            if(error.code === ErrorCodeFirebase.EMAIL_EXIST)
                throw new Error('User already exists');
        }
    }

    async delete({ uid }) {
        try {
          await deleteDoc(doc(this.firestoreDb, this.collection, uid));
      
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