import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      uid: string
      email?: string
      role?: string
    }
  }
}
