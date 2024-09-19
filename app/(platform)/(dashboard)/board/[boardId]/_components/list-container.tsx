"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useAction } from "@/hooks/use-action";
import { updateCardOrder } from "@/actions/update-card-order";
import { updateListOrder } from "@/actions/update-list-order";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { toast } from "sonner";
//import {List} from "@prisma/client"

interface ListContainersProps{
    data: ListWithCards[];
    boardId: string;

};

function reorder<T>(list: T[], startIndex: number, endIndex: number){
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed)

    return result;
}


export const ListContainer = ({
    data,
    boardId,
}: ListContainersProps)=>{
    const [orderedData, setOrderedData]= useState(data);

    const { execute: executeUpdateListOrder} = useAction(updateListOrder, {
      onSuccess: ()=>{
        toast.success("list reordered")
      },
      onError: (error)=>{
        toast.error(error)
      }
    } )
    const { execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
      onSuccess: ()=>{
        toast.success("Card reordered")
      },
      onError: (error)=>{
        toast.error(error)
      }
    } )
    

    useEffect(()=>{
        setOrderedData(data);
    }, [data]);
    
    const onDragEnd =(result: any)=>{
        const { destination, source, type} = result;
        if(!destination){
          return;
        }
        // droped in the same position
        if(
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ){
          return;
        }
        //if user moves a list
        if (type === "list"){
          const items = reorder(
            orderedData,
            source.index,
            destination.index,
          ).map((item, index) =>({...item, order:index  }));
          setOrderedData(items);
          //TODO: Trigger server actions
          executeUpdateListOrder({items, boardId})
        }
        //user moves card
        if (type === "card"){
          let newOrderedData = [...orderedData];

          //source and destination list
          const sourceList = newOrderedData.find(list => list.id === source.droppableId)
          const destList = newOrderedData.find(list=> list.id=== destination.droppableId)

          if(!sourceList || !destList){
            return;
          }
          // if list is empty
          if(!sourceList.cards){
            sourceList.cards =[];

          }
          //check if cards exist
          if (!destList.cards){
            destList.cards=[]
          }
          // moving the card in the same list
          if (source.droppableId === destination.droppableId){
            const reorderedCards = reorder(
              sourceList.cards,
              source.index,
              destination.index,
            );
            reorderedCards.forEach((card, idx) =>{
              card.order =idx
            });
            sourceList.cards = reorderedCards;
            setOrderedData(newOrderedData);
            //TODO: Trigger server actions
            executeUpdateCardOrder({
              boardId: boardId,
              items: reorderedCards,
            })

            //user moves the card to another list
          }else{
            // remove card from source list
            const [movedCard] = sourceList.cards.splice(source.index, 1);
            //assign the new list id to move
            movedCard.listId = destination.droppableId;
            //add card to the destination list
            destList.cards.splice(destination.index, 0, movedCard);

            sourceList.cards.forEach((card, idx)=>{
              card.order = idx;
            })
            //update the order for each card in the destination list
            destList.cards.forEach((card, idx) =>{
              card.order = idx;
            })

            setOrderedData(newOrderedData)
            //to trigger server action
          }

        }
    }

    return(
        <DragDropContext
          onDragEnd={onDragEnd}
        >
           <Droppable 
             droppableId="lists"
             type="list"
             direction="horizontal"
           >
             {(provided) =>(
            <ol 
               {...provided.droppableProps}
       
              ref={provided.innerRef}
              className="flex gap-x-3 h-full"
              >
               {orderedData.map((list, index)=>{
               return(
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                  />
                 ) 
               })}
              {provided.placeholder}
               <ListForm/>
              <div className="flex-shrink-0 w-1"/>
             </ol>
        )}
        </Droppable>
        </DragDropContext>
    )
}