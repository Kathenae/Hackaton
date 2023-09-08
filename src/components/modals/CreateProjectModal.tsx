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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
   projectName: z.string().min(4).max(23),
   repository: z.string().min(4),
})

type FormType = z.infer<typeof FormSchema>

export function CreateProjectModal({ open, onOpenStateChange }: ModalProps) {

   const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         projectName: '',
      }
   })

   const onSubmit = async (data: FormType, event: React.BaseSyntheticEvent | undefined) => {
      event?.preventDefault()
      alert(JSON.stringify(data, null, 2))
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
                              <FormLabel>Repository</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Choose a repository" />
                                    </SelectTrigger>
                                 </FormControl>

                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectLabel className="flex items-center space-x-2">
                                          <i className="i-mdi-github text-2xl" />
                                          <span>Public Github Repos</span>
                                       </SelectLabel>
                                       <SelectItem value="apple">Apple</SelectItem>
                                       <SelectItem value="banana">Banana</SelectItem>
                                       <SelectItem value="blueberry">Blueberry</SelectItem>
                                       <SelectItem value="grapes">Grapes</SelectItem>
                                       <SelectItem value="pineapple">Pineapple</SelectItem>
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )} />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button type="submit">Create Project</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
