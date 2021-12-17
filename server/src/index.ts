import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import { buildSchema } from "type-graphql";
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
