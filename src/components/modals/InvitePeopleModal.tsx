import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ModalProps, useModal } from "@/components/providers/ModalProvider"
import { Check, Copy, RefreshCcw } from "lucide-react"
import { Label } from "../ui/label"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { useParams } from "react-router-dom"

export function InvitePeopleModal({ open, onOpenStateChange }: ModalProps) {

   const [isCopying, setCopying] = useState(false)
   const [isLoading, setLoading] = useState(false)
   const { closeModal } = useModal()
   const { id } = useParams<{ id: string }>()
   const project = useQuery(api.projects.get, { id: id as Id<"projects"> })
   const generateInviteCode = useMutation(api.members.generateInviteCode)

   const onCopy = () => {
      setCopying(true)
      navigator.clipboard.writeText(makeInviteUrl())
      setTimeout(() => {
         setCopying(false)
      }, 1000)
   }

   const onGenerate = async () => {
      try{
         setLoading(true)
         await generateInviteCode({projectId: id as Id<"projects">})
      }
      catch(error){
         console.error(error)
      }
      finally{
         setLoading(false)
      }
   }

   function makeInviteUrl(){
      return window.location.host + '/join/' + project?.inviteCode
   }

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="text-center">
               <DialogTitle className="text-center">Invite People</DialogTitle>
               <DialogDescription className="text-center">
                  Invite people to your project and start sharing ideas!
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="items-center space-y-2">
                  <Label>Invite URL</Label>
                  <div className="flex items-center space-x-2">
                     <Input disabled={true} value={makeInviteUrl()} name="inviteCode" placeholder="" />
                     <Button onClick={onCopy} variant='secondary'>
                        {isCopying && <Check />}
                        {!isCopying && <Copy />}
                     </Button>
                  </div>
               </div>
            </div>
            <DialogFooter>
               <Button onClick={onGenerate} className="mr-auto" variant='link'>
                  Generate a new code
                  <RefreshCcw className={cn("ml-2 h-4 w-4", isLoading && 'animate-spin')} />
               </Button>
               <Button onClick={() => closeModal()} className="flex items-center space-x-2" disabled={isLoading} type="submit">
                  <span>Done</span>
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
