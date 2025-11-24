import { JWTPayload } from '../User.ts';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
