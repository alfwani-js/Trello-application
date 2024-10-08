"use server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { UpdateCardOrder } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId, orgId} = auth();
    if (!userId || !orgId){
        return { 
            error: "Unauthorized",
        };
    };
    const { items, boardId } = data;
    let updatedCards;
    try{
        const transaction = items.map((card)=>
          db.card.update({
            where:{
                id: card.id,
                List:{
                    board:{
                        orgId,
                    },
                },
            },
            data:{
                order: card.order,
                listId: card.listId,
            },
          }),
        );
            updatedCards = await db.$transaction(transaction)

    }catch(error){
        return{
            error: "failed to reorder"
        }

    }
    revalidatePath(`/board/${boardId}`);
    return {data: updatedCards};

};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)