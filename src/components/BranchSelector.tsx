import { Button } from "./ui/button"
import { Check, ChevronsUpDown, GitBranch } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"

type BranchSelectorProps = {
   repository?: string,
}

const branches = [
   "Master",
   "Production",
   "Staging",
   "Alpha",
 ];

export default function BranchSelector({ repository }: BranchSelectorProps) {

   const [open, setOpen] = useState(false)
   const [value, setValue] = useState("master")

   const handleSelect = (currentValue: string) => {
      console.log(currentValue)
      console.log(branches)
      setValue(currentValue)
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
                  className="w-[268px] justify-between overflow-clip"
               >
                  <GitBranch className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
                  {value
                     ? `${branches.find((branch) => branch.toLowerCase() === value)} (${repository})`
                     : repository}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[268px] p-0">
               <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No branch found.</CommandEmpty>
                  <CommandGroup>
                     {branches.map((branch) => (
                        <CommandItem
                           key={branch}
                           onSelect={handleSelect}
                           className="flex overflow-clip"
                        >
                           <Check
                              className={cn(
                                 "mr-2 h-4 w-4",
                                 value === branch.toLowerCase() ? "opacity-100" : "opacity-0"
                              )}
                           />
                           {branch}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </Command>
            </PopoverContent>
         </Popover>
      </>
   )
}