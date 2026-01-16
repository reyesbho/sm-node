import { collection, CollectionReference, Firestore } from "firebase/firestore";

export class UserModel {
  private firestoreDb: Firestore;
  private refCollection: CollectionReference;
  constructor({ firestoreDb }: { firestoreDb: Firestore }) {
    this.firestoreDb = firestoreDb;
    this.refCollection = collection(this.firestoreDb, 'usuarios');
  }

  async create(): Promise<void> {
  }

}
