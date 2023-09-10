import { DoorOpen, LucideShieldAlert, Menu, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "./providers/ModalProvider"
import { router } from "@/routes"

export function MenuToggle() {

   const { openModal } = useModal()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
               <span className="sr-only">Toggle Menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => openModal('invite-people')} className="cursor-pointer flex justify-start space-x-2">
               <UserPlus className="h-[1.4rem] w-[1.4rem]" />
               <span>Invite People</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModal('invite-people')} className="cursor-pointer flex justify-start space-x-2">
               <LucideShieldAlert className="h-[1.4rem] w-[1.4rem]" />
               <span>Manage Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.navigate('/')} className="cursor-pointer flex justify-start space-x-2">
               <DoorOpen className="h-[1.4rem] w-[1.4rem]" />
               <span>Home</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
