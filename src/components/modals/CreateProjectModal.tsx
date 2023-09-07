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
import { Label } from "@/components/ui/label"
import { ModalProps } from "@/components/providers/ModalProvider"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateProjectModal({ open, onOpenStateChange }: ModalProps) {

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Create Project</DialogTitle>
               <DialogDescription>
                  Create a new project and start collaborating
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="items-center space-y-2">
                  <Label htmlFor="name" className="text-right">
                     Project name
                  </Label>
                  <Input id="name" value="Pedro Duarte" className="col-span-3" />
               </div>
               <div className="items-center space-y-2">
                  <Label htmlFor="username" className="text-right">
                     Source Repo
                  </Label>
                  <Select>
                     <SelectTrigger>
                        <SelectValue placeholder="Choose a repository" />
                     </SelectTrigger>
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
               </div>
            </div>
            <DialogFooter>
               <Button type="submit">Save changes</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
