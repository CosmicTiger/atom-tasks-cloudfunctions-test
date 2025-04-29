import { onRequest } from "firebase-functions/v2/https";
import App from "./app";
import { TaskController, UserController } from "./controllers";

const controllers = [new UserController(), new TaskController()];
const app = new App(controllers);

exports.api = onRequest(app.getServer());
