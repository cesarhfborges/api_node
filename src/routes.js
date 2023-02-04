import express from "express";
import clients from "./controllers/clients.js";
import auth from "./controllers/auth.js";

const routes = express.Router();

routes.post("/auth/login", auth.login);
routes.post("/auth/register", auth.register);
routes.get("/auth/list", auth.list);

routes.get("/clients", clients.findAll);
routes.post("/clients", clients.addClient);
routes.get("/clients/:id", clients.findClient);
routes.put("/clients/:id", clients.updateClient);
routes.delete("/clients/:id", clients.deleteClient);

export { routes as default };
