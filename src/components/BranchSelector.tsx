import { Button } from "./ui/button"
import { Check, ChevronsUpDown, GitBranch } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Branch, Branches } from "@/lib/github"

type BranchSelectorProps = {
   repository?: string,
   branches?: Branches,
   currentBranch: Branch | undefined,
   onBranchSelected: (branch?: Branch) => void
}

export default function BranchSelector({ repository, branches, currentBranch, onBranchSelected }: BranchSelectorProps) {
   const [open, setOpen] = useState(false)

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
                  {currentBranch? `${currentBranch.name} (${repository})`: repository}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[268px] p-0">
               <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                     {branches?.map((branch) => (
                        <CommandItem
                           key={branch.name}
                           onSelect={handleSelect}
                           className="flex overflow-clip"
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