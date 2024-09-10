"use client";

import {List} from "@prisma/client"

interface ListContainersProps{
    data: List[];
    boardId: string;

};

export const ListContainer = ({
    data,
    boardId,
}: ListContainersProps)=>{
    return(
        <div>
            List Container
        </div>
    )
}