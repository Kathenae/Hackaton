import { DoorOpen, Home, LucideShieldAlert, Menu, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "./providers/ModalProvider"
import { router } from "@/routes"
import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import { useStoredUser } from "./providers/StoredUserProvider"

type MenuToggleProps = {
   project: ReturnType<typeof useQuery<typeof api.projects.getForUser>>
}

export function MenuToggle({ project }: MenuToggleProps) {

   const { openModal } = useModal()
   const { user } = useStoredUser()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
               <span className="sr-only">Toggle Menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => router.navigate('/')} className="cursor-pointer flex justify-start space-x-2">
               <Home className="h-[1.4rem] w-[1.4rem]" />
               <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModal('invite-people')} className="cursor-pointer flex justify-start space-x-2">
               <UserPlus className="h-[1.4rem] w-[1.4rem]" />
               <span>Invite People</span>
            </DropdownMenuItem>
            {(project?.ownerId == user?._id) &&
               <DropdownMenuItem onClick={() => openModal('manage-members', project)} className="cursor-pointer flex justify-start space-x-2">
                  <LucideShieldAlert className="h-[1.4rem] w-[1.4rem]" />
                  <span>Manage Members</span>
               </DropdownMenuItem>
            }
            {(project?.ownerId != user?._id) &&
               <DropdownMenuItem onClick={() => openModal('leave-project', project)} className="cursor-pointer text-rose-500 flex justify-start space-x-2">
                  <DoorOpen className="h-[1.4rem] w-[1.4rem]" />
                  <span>Leave Project</span>
               </DropdownMenuItem>
            }
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
