"use client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";


export const CardModal = () =>{
    const  id = useCardModal((state)=> state.id);
    const isOpen = useCardModal((state)=> state.isOpen);
    const onClose = useCardModal((state) => state.onClose);

    const {data: cardData} =useQuery<CardWithList>({
        queryKey: ["Card", id],
        queryFn:() => fetcher(`/api/Card/${id}`),
    });
    return(
        <Dialog
          open={isOpen}
          onOpenChange={onClose}
        >
            <DialogContent>
                {cardData?.title}
                coming soon! 
            </DialogContent>
        </Dialog>
    );
};