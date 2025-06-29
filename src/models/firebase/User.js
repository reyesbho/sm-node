import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
export class UserModel{
    constructor({auth}){
        this.auth = auth;
    }

    async create({inputUser}){
        const {email, password} = inputUser;
        const user = await createUserWithEmailAndPassword(this.auth, email, password);
        if(!user){
            return false;
        }
        return user;
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