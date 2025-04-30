import { z } from "zod";

const dateFieldPreprocessOptional = z.preprocess(
    (val) =>
        typeof val === "string" || val instanceof Date
            ? new Date(val)
            : undefined,
    z.date().optional()
);

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
    isCompleted: z.boolean().optional().default(false),
    createdBy: z.string().default(() => "system"),
    updatedBy: z
        .string()
        .optional()
        .default(() => "system"),
    createdAt: dateFieldPreprocessOptional,
    updatedAt: dateFieldPreprocessOptional,
});

export type TaskSchemaType = z.infer<typeof taskSchema>;
