"use server"

import { db } from '@/lib/db';
import { InputType, ReturnType} from './types';
import { auth } from "@clerk/nextjs";
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CreateBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    if(!userId || !orgId ){
        return{
            error: "unauthorised",
        };
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,

    ] = image.split("|");

    console.log({
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,

})

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML){
        return {
            error: "Missing fields. failed to create board"
        };
    }

    let board;
    try {
        //throw new Error("not implemented")
        board = await db.board.create({
           data: {
            title,
            orgId,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageUserName,
            imageLinkHTML
           } 
        })
        
    } catch (error) {
        return{
            error: "Failed to create."
        }
        
    }

    revalidatePath(`/board/${board.id}`)
    return{ data: board };
}

export const createBoard = createSafeAction(CreateBoard, handler);

