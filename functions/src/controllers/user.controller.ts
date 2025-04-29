import { Router, Request, Response } from "express";
import { Controller } from "../interface/";
import { db } from "../config/firebase";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";
import { validateData } from "../middleware/validateData.middleware";
import { userLoginSchema } from "../schemas/";

/**
 *
 *
 * @class UserController
 * @implements {Controller}
 */
class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userFirestore: CollectionReference<
        DocumentData,
        DocumentData
    > | null = null;

    /**
     * Creates an instance of UserController.
     * @memberof UserController
     */
    constructor() {
        this.initializeRoutes();

        if (!db) {
            throw new Error("Firebase Firestore is not initialized");
        }
        this.userFirestore = db.collection("users");
    }

    /**
     * @description Initializes the routes for the UserController
     *
     * @private
     * @memberof UserController
     */
    private initializeRoutes() {
        this.router.post(
            `${this.path}/login-or-create`,
            validateData(userLoginSchema),
            this.loginOrCreate.bind(this)
        );
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @return {*}
     * @memberof UserController
     */
    private async loginOrCreate(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        try {
            if (!this.userFirestore) {
                return res
                    .status(500)
                    .json({ error: "Database not connected" });
            }

            const userQuery = this.userFirestore.where("email", "==", email);
            const userQueryDoc = await userQuery.get();

            if (!userQueryDoc.empty) {
                const userDoc = userQueryDoc.docs[0];
                const userData = { id: userDoc.id, ...userDoc.data() };

                return res.status(200).json({
                    message: "User already exists. Login successful.",
                    data: userData,
                });
            } else {
                const userRef = this.userFirestore.doc();
                await userRef.set({ email });
                const userData = { id: userRef.id, email };
                return res.status(201).json({
                    message: "User created successfully",
                    data: userData,
                });
            }
        } catch (error) {
            console.error("Error logging in or creating user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default UserController;
