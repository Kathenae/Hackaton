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
import { ModalProps } from "@/components/providers/ModalProvider"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useMutation } from "convex/react"
import { api } from '../../../convex/_generated/api'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import * as github from '@/lib/github';
import * as z from "zod"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
   projectName: z.string().min(4).max(23),
   repository: z.string().min(4),
})

type FormType = z.infer<typeof FormSchema>

export function CreateProjectModal({ open, onOpenStateChange }: ModalProps) {
   
   const createProject = useMutation(api.projects.createProject)
   const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         projectName: '',
      }
   })
   const [isLoading, setLoading] = useState(false)

   // Load public repositories for current user from the github API
   const [repos, setRepos] = useState<{ name: string, id: number }[]>()
   const { user } = useUser()
   useEffect(() => {
      async function fetchRepos() {
         if (!user?.username) {
            return
         }

         const response = await github.listRepos(user.username);
         const reposData = response.data.map(repo => ({ name: repo.name, id: repo.id }))
         setRepos(reposData)
      }

      fetchRepos()
   }, [user?.username])

   const onSubmit = async (data: FormType, event: React.BaseSyntheticEvent | undefined) => {
      event?.preventDefault()
      try{
         setLoading(true)
         await createProject({name: data.projectName, repo: data.repository})
      }
      catch(error){
         console.error(error)
      }
      finally{
         setLoading(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                     <DialogTitle>Create Project</DialogTitle>
                     <DialogDescription>
                        Create a new project and start collaborating
                     </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="items-center space-y-2">
                        <FormField name="projectName" control={form.control} render={({ field }) => (
                           <FormItem>
                              <FormLabel>Project Name</FormLabel>
                              <FormControl>
                                 <Input value={field.value} onChange={field.onChange} placeholder="Shinning Glitter ✨" />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )} />
                     </div>
                     <div className="items-center space-y-2">
                        <FormField name="repository" control={form.control} render={({ field }) => (
                           <FormItem>
                              <FormLabel>Github Repository</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Choose a repository" />
                                    </SelectTrigger>
                                 </FormControl>

                                 <SelectContent>
                                    <SelectGroup>
                                       <ScrollArea className="h-[290px]">
                                          <SelectLabel className="flex items-center space-x-2">
                                             <i className="i-mdi-github text-2xl" />
                                             <span>Public Github Repos</span>
                                          </SelectLabel>
                                          {repos?.map((repo) => (
                                             <SelectItem value={repo.name} key={repo.id}>{repo.name}</SelectItem>
                                          ))}
                                       </ScrollArea>
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )} />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button className="flex items-center space-x-2" disabled={isLoading} type="submit">
                        <span>Create Project</span>
                        {isLoading && <Loader2 className="animate-spin" />}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
