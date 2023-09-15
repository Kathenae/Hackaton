import { router } from "@/routes"
import { api } from "../../convex/_generated/api"
import { useAction, useQuery } from "convex/react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function JoinPage() {

   const [errorMessage, setErrorMessage] = useState('')
   const [loading, setLoading] = useState(false)
   const { inviteCode } = useParams()
   const projectId = useQuery(api.projects.projectIdForCode, { inviteCode })
   const joinProject = useAction(api.github.joinProjectAsCollaborator)

   const onAccept = async () => {
      try{
         setLoading(true)
         setErrorMessage('')

         if (!inviteCode) {
            setErrorMessage('No invite code provided');
            return
         }
   
         const response = await joinProject({ inviteCode })
   
         if (response.success) {
            router.navigate('/project/' + projectId)
         }
   
         if(response.error){
            setErrorMessage(response.error)
         }
      }
      catch(error){
         console.error(error)
      }
      finally{
         setLoading(false)
      }
   }

   const onGoHome = () => {
      router.navigate('/')
   }
   return (
      <div className="w-screen h-screen flex items-center justify-center">
         {loading && <Loader2 className="text-neutral-700 h-32 w-32 animate-spin" />}
         <Dialog open={!loading}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                     <AlertCircle />
                     <span>Join Project</span>
                  </DialogTitle>
                  <DialogDescription className="!mt-4">
                     Are you sure you want to join this project? You will be added as a collaborator on the project's github repo
                  </DialogDescription>
               </DialogHeader>

               <DialogFooter className="justify-center items-center">
                  <span className="mr-auto text-destructive">{errorMessage}</span>
                  <Button onClick={onAccept} type="submit">Accept</Button>
                  <Button variant={'secondary'} onClick={onGoHome} type="submit">Go Home</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}