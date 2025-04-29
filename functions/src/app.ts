import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware";
import Controller from "./interface/controller.interface";

/**
 *
 *
 * @class App
 */
class App {
    public app: express.Application;

    /**
     * Creates an instance of App.
     * @param {Controller[]} controllers
     * @memberof App
     */
    constructor(controllers: Controller[]) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    /**
     * @description Starts the server
     *
     * @return {*}
     * @memberof App
     */
    public getServer() {
        return this.app;
    }

    /**
     * @description Starts the middlewares used in the Cloud Function App
     *
     * @private
     * @memberof App
     */
    private initializeMiddlewares() {
        this.app.use(loggerMiddleware);
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     *
     *
     * @private
     * @param {Controller[]} controllers
     * @memberof App
     */
    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
}

export default App;
