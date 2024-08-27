"use server"

import { db } from '@/lib/db';
import { InputType, ReturnType} from './types';
import { auth } from "@clerk/nextjs";
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CreateBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId } = auth();
    if(!userId){
        return{
            error: "unauthorised",
        };
    }

    const { title } = data;

    let board;
    try {
        //throw new Error("not implemented")
        board = await db.board.create({
           data:{
            title,
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

