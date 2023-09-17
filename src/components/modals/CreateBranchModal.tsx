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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAction } from "convex/react"
import { api } from '../../../convex/_generated/api'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as github from '@/lib/github';
import * as z from "zod"
import { Check, ChevronsUpDown, GitBranch, Loader2 } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { cn } from "@/lib/utils"
import { useToast } from "../ui/use-toast"

const FormSchema = z.object({
   branchName: z.string().min(4).max(23),
   baseBranchName: z.string().min(4),
})

type FormType = z.infer<typeof FormSchema>
type ModalData = { 
   branches: github.Branches, 
   repo: string, 
   repoOwner: string, 
   onBranchCreated: (bracnh: github.Branch) => void 
}

export function CreateBranchModal({ open, onOpenStateChange }: ModalProps) {

   const { toast } = useToast()
   const { closeModal, data: modalData } = useModal<ModalData>()
   const [isLoading, setLoading] = useState(false)
   const [dropdownOpen, setDropdownOpen] = useState(false)

   const createBranch = useAction(api.github.createBranch)
   const form = useForm<FormType>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         branchName: '',
         baseBranchName: github.getMainBranch(modalData.branches)?.name ?? '',
      }
   })

   const onSubmit = async (data: FormType, event: React.BaseSyntheticEvent | undefined) => {
      event?.preventDefault()
      try {
         setLoading(true)
         const baseBranch = modalData.branches.find(b => b.name == data.baseBranchName)
         
         if(!baseBranch){
            return
         }

         const response = await createBranch({ 
            branchName: data.branchName, 
            fromSha: baseBranch.commit.sha, 
            repo: modalData.repo, 
            repoOwner: modalData.repoOwner 
         })

         if (response?.status === 201) {
            const branch = await github.getBranch({repo: modalData.repo, username: modalData.repoOwner, branch: data.branchName})
            modalData.onBranchCreated(branch.data)
            closeModal()
            toast({
               title: 'Branch Created',
               description: `"${data.branchName}" created successfully`
            })
         }
      }
      catch (error) {
         console.error(error)
      }
      finally {
         setLoading(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                     <DialogTitle>Create Branch</DialogTitle>
                     <DialogDescription>
                        Create a branch
                     </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="items-center space-y-2">
                        <FormField name="branchName" control={form.control} render={({ field }) => (
                           <FormItem>
                              <FormLabel>Branch Name</FormLabel>
                              <FormControl>
                                 <Input value={field.value} onChange={field.onChange} placeholder="Feature Branch" />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )} />
                     </div>
                     <div className="items-center space-y-2">
                        <FormField name="baseBranchName" control={form.control} render={({ field }) => (
                           <FormItem>
                              <FormLabel>From Branch</FormLabel>
                              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       role="combobox"
                                       aria-expanded={open}
                                       className="w-full flex justify-between whitespace-nowrap overflow-clip"
                                    >
                                       <GitBranch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                       <span className="whitespace-nowrap max-w-[290px] overflow-clip">{field.value}</span>
                                       <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-full p-0">
                                    <Command>
                                       <CommandInput placeholder="Search branches..." />
                                       <CommandEmpty>No branch found.</CommandEmpty>
                                       <CommandGroup>
                                          {modalData.branches?.map((branch) => (
                                             <CommandItem
                                                key={branch.name}
                                                value={branch.name}
                                                onSelect={(value) => {
                                                   field.onChange(value)
                                                   setDropdownOpen(false)
                                                }}
                                                className="flex overflow-clip cursor-pointer"
                                             >
                                                <Check
                                                   className={cn(
                                                      "mr-2 h-4 w-4",
                                                      field.value === branch.name ? "opacity-100" : "opacity-0"
                                                   )}
                                                />
                                                {branch.name}
                                             </CommandItem>
                                          ))}
                                       </CommandGroup>
                                    </Command>
                                 </PopoverContent>
                              </Popover>
                              <FormMessage />
                           </FormItem>
                        )} />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button className="flex items-center space-x-2" disabled={isLoading} type="submit">
                        <span>Create Branch</span>
                        {isLoading && <Loader2 className="animate-spin" />}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
