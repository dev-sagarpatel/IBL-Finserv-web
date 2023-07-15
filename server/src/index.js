require("dotenv").config();
global.framework = {};
// require('../core/migration');
// require('../core/models');
require("../core/services");
require("../core/functions");
require("../core/userFunctions");
const express = require("express");
const useImport = require("../config/use");
const routes = require("../core/routes");
const socketIO = require("socket.io");
const http = require("http");
const helmet = require("helmet");
const middlewares = require("../middlewares");
const siteSettings = require("../config/sitesetting.json");
const bodyParser = require("body-parser");

// defining the Express app
const app = express();

// SECURITY HEADERS
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  res.set({
    "Referrer-Policy": "same-origin",
  });
  next();
});

//multiple app.use
for (key in useImport) {
  app.use(useImport[key]);
}

app.use("/uploads", [
  [
    express.static(
      siteSettings.storagePath
        ? siteSettings.storagePath.path || "../uploads"
        : "../uploads"
    ),
  ],
]);
for (let key in routes.public) {
  app[routes.public[key].method](
    routes.public[key].path,
    routes.public[key].middlewares || [],
    routes.public[key].action
  );
}
/* validate apis from here */
for (let key in routes.protected) {
  let middleware = [
    middlewares.apiVerify.tokenVerification,
    routes.protected[key].globalMiddlewares,
    routes.protected[key].middlewares,
  ];
  app[routes.protected[key].method](
    routes.protected[key].path,
    middleware,
    routes.protected[key].action
  );
}

app.use(async (error, req, res, next) => {
  console.error(error, " <=== error");
  return res.status(500).send({ message: error.message });
});

let server = http.createServer(app);

let io = socketIO(server);
framework.socket = [];
io.on("connection", (socket) => {
  framework.socket.push(socket);

  console.log("User Connected!!");
  socket.on("disconnect", () => {
    console.log("user disconnected!!");
  });
});

server.listen(process.env.PORT, async () => {
  console.log("listening on port " + process.env.PORT);
});
