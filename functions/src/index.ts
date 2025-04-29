import { onRequest } from "firebase-functions/v2/https";
import App from "./app";
import { UserController } from "./controllers";

const controllers = [new UserController()];
const app = new App(controllers);

exports.api = onRequest(app.getServer());
