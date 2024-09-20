import { ModalProvider } from "@/components/providers/modal-provider";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const platformLayout =({
    children
}:{
    children: React.ReactNode
}) => {
    return (
        
            <ClerkProvider>
            <QueryProvider>
            <Toaster/>

            <ModalProvider/>
            {children}
            </QueryProvider>
            
        </ClerkProvider>
    )
}

export default platformLayout;