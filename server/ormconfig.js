module.exports = {
  type: "mysql",
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: false,
  entities: ["./dist/entities/*.js"],
  migrations: ["./dist/migrations/*.js"],
};
