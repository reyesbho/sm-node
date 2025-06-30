import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
            if(error.code == 'auth/email-already-in-use')
                throw new Error('User already exists');
        }
        
    }

    async login ({inputUser}){
        const {email, password} = inputUser;
        const login = await signInWithEmailAndPassword(this.auth, email, password);
        if(!login){
            return false;
        }
        return login;
    }

    async logout (){
        await signOut(this.auth).then(() => {
            return true;
        }).catch((error) => {
            return false;
        });
    }

}