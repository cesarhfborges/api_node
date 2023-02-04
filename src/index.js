import express from 'express';
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from 'cors';
import morgan from 'morgan';
import timeout from "connect-timeout";
import db from "./db.js";
import routes from "./routes.js";

const app = express();

app.use(helmet());
app.use(timeout('6s'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use(routes);

db.sync().then(() => {
    console.log(`Banco de dados conectado`);
}).catch();

// starting the server
const server = app.listen(process.env.APP_PORT, () => {
    console.log('listening on port 3001');
});
