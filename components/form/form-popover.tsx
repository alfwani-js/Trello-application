"use client"

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAction } from "@/hooks/use-action"
import { createBoard } from "@/actions/create-board"
import { Button } from "@/components/ui/button"
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import {toast} from "sonner";
import { FormPicker } from "./form-picker"
import { ElementRef, useRef } from "react"


interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover =({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);

    const {execute, fieldErrors } = useAction(createBoard,{
        onSuccess:(data) =>{
            closeRef.current?.click();            
            toast.success("Board created successfully");
            router.push(`/board/${data.id}`);
        },
        onError:(error) =>{
            
            toast.error(error)
        }
    });

    const onSubmit = ( formData: FormData) =>{
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        console.log("here it is" + image)

        execute({title, image});
    }


    return(
        <Popover>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-80 pt-3"
          side={side}
          sideOffset={sideOffset}
          >
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          create board
          </div>
          <PopoverClose ref={closeRef} asChild>
            <Button
              className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
              variant="ghost"
            >
                <X/>
            </Button>
            </PopoverClose>
            <form action={onSubmit} className="space-y-4">
                <FormPicker
                  id="image"
                  errors={fieldErrors}
                />
                <div className="space-y-4">
                    <FormInput
                     id="title"
                     label="board title"
                     type="text"
                     errors={fieldErrors}

                    />
                </div>
                <FormSubmit className="w-full">
                    create
                </FormSubmit>
            </form>
          </PopoverContent>
        
        </Popover>
    )
}