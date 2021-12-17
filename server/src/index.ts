import express from "express";
import "dotenv-safe/config";
import cors from "cors";
import { __prod__ } from "./constants/__prod__";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloWorldResolver } from "./resolvers/HelloWorld";

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [`${__dirname}/resolvers/**/*.{ts,js}`],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
  });
};

main().catch((error) => console.error(error));
