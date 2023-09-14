import { router } from "@/routes"
import { api } from "../../convex/_generated/api"
import { useMutation } from "convex/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function JoinPage() {

   const [message, setMessage] = useState('')
   const { inviteCode } = useParams()
   const joinProject = useMutation(api.members.joinProject)

   useEffect(() => {
      (async () => {

         if (!inviteCode) {
            setMessage('No invite code provided');
            return
         }

         const response = await joinProject({ inviteCode })

         if (!response.error) {
            router.navigate('/project/' + response.data?.projectId)
         }
         else {
            setMessage(response.error)
         }
      })()

   }, [inviteCode, joinProject])

   const onGoHome = () => {
      router.navigate('/')
   }
   return (
      <div className="w-screen h-screen flex items-center justify-center">
         {!message && <Loader2 className="text-neutral-700 h-32 w-32 animate-spin" />}
         <Dialog open={!!message}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                     <AlertCircle className="w-6 h-6" />
                     <span>Ooops</span>
                  </DialogTitle>
                  <DialogDescription className="!mt-4">
                     {message}
                  </DialogDescription>
               </DialogHeader>

               <DialogFooter className="justify-center">
                  <Button onClick={onGoHome} type="submit">Go Home</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}