import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(1, {
        message: "This field has to be filled in order to create a task.",
    }),
    description: z
        .string()
        .max(250, {
            message: "The description should not be major than 250 characters",
        })
        .optional(),
    is_completed: z.boolean().optional().default(false),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
});
