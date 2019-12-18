const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const sessions = require("express-session"); // <<<<< install express-session
const KnexSessionStore = require('connect-session-knex')(sessions); // to store sessions in database

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const knex = require('../database/dbConfig.js');

const server = express();

const sessionConfiguration = {
  // session storage options
  name: "chocolatechip", // default would be sid
  secret: "keep it secret, keep it safe!", // used for encryption (must be an environment variable)
  saveUninitialized: true, // has implications with GDPR laws
  resave: false,

  //how to store the sessions
  store: new KnexSessionStore({ // DO NOT FORGET THE new KEYWORD
    knex, // imported from dbConfig.js
    tablename: 'sessions',
    createtable: true,
    sidfieldname: 'sid',
    clearInterval: 1000 * 60 * 10
  }),

  // cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
    secure: false, // if false the cookie es sent over http, if true only sent over https
    httpOnly: true, // if true JS cannot access the cookie
  },
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration)); // add a req.session object
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.get("/", (req, res) => {
  res.json({ api: "up" });
});
module.exports = server;