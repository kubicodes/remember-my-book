import express from "express";
import "dotenv-safe/config";
import cors from "cors";
import { __prod__ } from "./constants/__prod__";
import { createConnection } from "typeorm";

const main = async () => {
  const dbConnection = await createConnection();
  await dbConnection.runMigrations();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(","),
      credentials: true,
    })
  );

  app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
  });
};

main().catch((error) => console.error(error));
