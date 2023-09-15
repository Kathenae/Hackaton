import { Button } from "./ui/button"
import { Check, ChevronsUpDown, GitBranch, Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Branch, Branches } from "@/lib/github"
import { useModal } from "./providers/ModalProvider"

type BranchSelectorProps = {
   repo?: string,
   repoOwner?: string,
   branches?: Branches,
   currentBranch: Branch | undefined,
   onBranchSelected: (branch?: Branch) => void
   onBranchCreated: (branch: Branch) => void
}

export default function BranchSelector({ repo, branches, repoOwner, currentBranch, onBranchSelected, onBranchCreated }: BranchSelectorProps) {
   const [open, setOpen] = useState(false)
   const { openModal } = useModal()
   const handleSelect = (branchName: string) => {
      const selectedBranch = branches?.find(b => b.name.toLowerCase() == branchName.toLowerCase());
      onBranchSelected(selectedBranch)
      setOpen(false)
   }

   return (
      <>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[268px] flex justify-between whitespace-nowrap overflow-clip"
               >
                  <GitBranch className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
                  <span className="whitespace-nowrap max-w-[188px] overflow-clip">{currentBranch? `${currentBranch.name} (${repo})`: repo}</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[268px] p-0">
               <Command>
                  <CommandInput placeholder="Search branches..." />
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                     <CommandItem key={'create-branch'} onSelect={() => openModal('create-branch', {branches, repo, repoOwner, onBranchCreated})} className="text-muted-foreground cursor-pointer">
                        <Plus /> 
                        <span>New Branch</span>
                     </CommandItem>
                     {branches?.map((branch) => (
                        <CommandItem
                           key={branch.name}
                           onSelect={handleSelect}
                           className="flex overflow-clip cursor-pointer"
                        >
                           <Check
                              className={cn(
                                 "mr-2 h-4 w-4",
                                 currentBranch?.name === branch.name? "opacity-100" : "opacity-0"
                              )}
                           />
                           {branch.name}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </Command>
            </PopoverContent>
         </Popover>
      </>
   )
}