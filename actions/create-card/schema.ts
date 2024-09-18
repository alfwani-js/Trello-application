import { z } from "zod";

export const CreateCard = z.object({
    title: z.string({
        required_error:"Title is required",
        invalid_type_error: "Title is required",

    }).min(3, {
        message: "Type three characters"
    }),
    boardId: z.string(),
    listId: z.string(),
});