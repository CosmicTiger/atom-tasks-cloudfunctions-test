import { z } from "zod";

export const userLoginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "This field has to be filled in order to login." })
        .email("This is not a valid email."),
});
