import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ErrorCodeFirebase } from "../../utils/utils.js";
export class UserModel{
    constructor({auth}){
        this.auth = auth;
    }

    async create({inputUser}){
        const {email, password} = inputUser;
        try {
            const user = await createUserWithEmailAndPassword(this.auth, email, password);
            if(!user){
                return false;
            }
            return user;    
        } catch (error) {
            if(error.code === ErrorCodeFirebase.EMAIL_EXIST)
                throw new Error('User already exists');
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