import { Response, Request } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";

export interface CustomContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
}
