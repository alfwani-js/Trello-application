"use server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { UpdateList } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId, orgId} = auth();
    if (!userId || !orgId){
        return {
            error: "Unauthorized",
        };
    };
    const { title, id, boardId } = data;
    let list;
    try{
        list = await db.list.update({
            where:{
                id: id,
                boardId,
                board:{
                    orgId
                },
            },
            data:{
                title,
            }
        })


    }catch(error){
        console.error(error);
        return{
            error: "failed to work"
        }

    }
    revalidatePath(`/board/${boardId}`);
    return {data: list};

};

export const updateList = createSafeAction(UpdateList, handler)