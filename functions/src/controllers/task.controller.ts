import { Request, Response, Router } from "express";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { validateData } from "../middleware/validateData.middleware";
import { taskSchema, TaskSchemaType } from "../schemas";
import { DocumentSnapshot } from "firebase-functions/firestore";

/**
 * @description TaskController is responsible for handling task-related routes and operations.
 *
 * @class TaskController
 */
class TaskController {
    public path = "/tasks";
    public router = Router();
    private taskFirestore: CollectionReference<
        DocumentData,
        DocumentData
    > | null = null;

    /**
     * Creates an instance of TaskController.
     * @memberof TaskController
     */
    constructor() {
        this.initializeRoutes();

        if (!db) {
            throw new Error("Firebase Firestore is not initialized");
        }
        this.taskFirestore = db.collection("tasks");
    }

    /**
     *
     *
     * @private
     * @memberof TaskController
     */
    private initializeRoutes() {
        this.router.get(`${this.path}`, this.getAllTasks.bind(this));
        this.router.post(
            `${this.path}`,
            validateData(taskSchema),
            this.createTask.bind(this)
        );
        this.router.get(`${this.path}/:id`, this.getTaskById.bind(this));
        this.router.put(
            `${this.path}/:id`,
            validateData(taskSchema),
            this.updateTask.bind(this)
        );
        this.router.patch(
            `${this.path}/:id/complete`,
            this.completeTask.bind(this)
        );
        this.router.delete(`${this.path}/:id`, this.deleteTask.bind(this));
    }

    /**
     *
     * @private
     * @param {CollectionReference<DocumentData, DocumentData>} taskFromFirestore
     * @return {*}  {TaskSchemaType}
     * @memberof TaskController
     */
    private taskFormatter(taskFromFirestore: DocumentSnapshot): TaskSchemaType {
        const task = taskFromFirestore.data();
        if (!task) {
            throw new Error("Task data is undefined");
        }

        return taskSchema.parse({
            id: taskFromFirestore.id,
            ...task,
            createdAt: task.createdAt.toDate(),
            updatedAt: task.updatedAt.toDate(),
        });
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async getAllTasks(req: Request, res: Response) {
        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const tasksSnapshot = await this.taskFirestore.get();
            const tasks = tasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return res.status(200).json(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async createTask(req: Request, res: Response) {
        const taskData: TaskSchemaType = req.body;

        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const taskRef = this.taskFirestore.doc();
            await taskRef.set(taskData);

            const taskDoc = await taskRef.get();
            const taskFormatted = this.taskFormatter(taskDoc);

            return res.status(201).json({
                message: "Task created successfully",
                data: taskFormatted,
            });
        } catch (error) {
            console.error("Error creating task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async getTaskById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const taskRef = this.taskFirestore.doc(id);
            const taskDoc = await taskRef.get();

            if (!taskDoc.exists) {
                return res.status(404).json({ error: "Task not found" });
            }
            const taskFormatted = this.taskFormatter(taskDoc);

            return res.status(200).json(taskFormatted);
        } catch (error) {
            console.error("Error fetching task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async updateTask(req: Request, res: Response) {
        const { id } = req.params;
        const taskData: TaskSchemaType = req.body;

        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const taskRef = this.taskFirestore.doc(id);
            await taskRef.update(taskData);

            const taskDoc = await taskRef.get();
            const taskFormatted = this.taskFormatter(taskDoc);

            return res
                .status(200)
                .json({
                    message: "Task updated successfully",
                    data: taskFormatted,
                });
        } catch (error) {
            console.error("Error updating task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async completeTask(req: Request, res: Response) {
        const { id } = req.params;

        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const taskRef = this.taskFirestore.doc(id);
            await taskRef.update({ is_completed: true });

            return res.status(200).json({ message: "Task changed status" });
        } catch (error) {
            console.error("Error completing task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     *
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof TaskController
     */
    private async deleteTask(req: Request, res: Response) {
        const { id } = req.params;

        try {
            if (!this.taskFirestore) {
                return res
                    .status(500)
                    .json({ error: "Firestore not initialized" });
            }

            const taskRef = this.taskFirestore.doc(id);
            await taskRef.delete();

            return res
                .status(200)
                .json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error deleting task:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default TaskController;
