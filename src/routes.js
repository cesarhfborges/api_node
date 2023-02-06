import express from "express";
import {verifyJWT} from "./middlewares/authentication.js";
import clients from "./controllers/clients.js";
import auth from "./controllers/auth.js";

const routes = express.Router();

routes.post("/auth/login", auth.login);
routes.post("/auth/register", auth.register);

routes.get("/auth/confirm", auth.sendConfirmationEmail);
routes.get("/auth/confirm/:confirmation", auth.confirmEmail);

routes.post("/auth/refresh", verifyJWT, auth.refresh);

// authenticated routes
routes.get("/clients", verifyJWT, clients.findAll);
routes.post("/clients", verifyJWT, clients.addClient);
routes.get("/clients/:id", verifyJWT, clients.findClient);
routes.put("/clients/:id", verifyJWT, clients.updateClient);
routes.delete("/clients/:id", verifyJWT, clients.deleteClient);

export { routes as default };
