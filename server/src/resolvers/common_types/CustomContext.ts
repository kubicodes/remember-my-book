import { Response, Request } from "express";

export interface CustomContext {
  req: Request;
  res: Response;
}
