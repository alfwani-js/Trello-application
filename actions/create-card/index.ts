"use server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateCard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId, orgId} = auth();
    if (!userId || !orgId){
        return { 
            error: "Unauthorized",
        };
    };
    const { title, boardId, listId } = data;
    let card;
    try{
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId,
                },
            },
        });
        if (!list) {
            return{
                error: "List not found",
            };
        };
        const lastCard = await db.card.findFirst({
            where: {listId},
            orderBy:{ order:"desc"},
            select: { order: true},
        });
        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });
    }catch(error){
        return{
            error: "failed to create"
        }

    }
    revalidatePath(`/board/${boardId}`);
    return {data: card};

};

export const createCard = createSafeAction(CreateCard, handler)