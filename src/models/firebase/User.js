import { getAuth } from "firebase-admin/auth";

export class UserModel {
  constructor() {
    this.auth = getAuth();
  }

  async create({ inputUser }) {
    try {
      return await this.auth.createUser(inputUser);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async logout() {
    // Opcional: revocar tokens
    await this.auth.revokeRefreshTokens(uid);
  }
}
