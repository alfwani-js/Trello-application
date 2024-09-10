"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
//import {List} from "@prisma/client"

interface ListContainersProps{
    data: ListWithCards[];
    boardId: string;

};

export const ListContainer = ({
    data,
    boardId,
}: ListContainersProps)=>{
    return(
        <ol>
            <ListForm/>
            <div className="flex-shrink-0 w-1"/>
        </ol>
    )
}