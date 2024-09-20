import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function Get(
    req: Request,
    { params }: { params:{
        cardId: string
    }}
){
    try {
        const { userId, orgId} = auth();
        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401});

        }
        const card = await db.card.findUnique({
            where:{
                id: params.cardId,
                List:{
                    board:{
                        orgId
                    },
                },
            },
            include:{
                List:{
                    select:{
                        title:true,
                    },
                },
            },
        });
        return NextResponse.json(card);
        
    } catch (error) {
        return new NextResponse("Internal Error", 
            {status: 500}
        );
        
    }
}