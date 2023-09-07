import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "./providers/ModalProvider"

export function MenuToggle() {

   const { setModal } = useModal()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
               <span className="sr-only">Toggle Menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setModal('create-project')} className="cursor-pointer flex justify-start space-x-2">
               <Plus className="h-[1.4rem] w-[1.4rem]" />
               <span>Create Project</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
