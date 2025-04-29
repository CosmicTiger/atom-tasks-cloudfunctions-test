import { z } from "zod";

export const taskSchema = z.object({
    id: z.string().optional(),
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
    createdBy: z.string().default(() => "system"),
    updatedBy: z
        .string()
        .optional()
        .default(() => "system"),
    createdAt: z
        .date()
        .optional()
        .default(() => new Date()),

    updatedAt: z
        .date()
        .optional()
        .default(() => new Date()),
});

export type TaskSchemaType = z.infer<typeof taskSchema>;
