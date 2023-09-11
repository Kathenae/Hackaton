import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BranchFile } from "@/lib/github"
import { ScrollArea } from "./ui/scroll-area"
import { getFileIconClass } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type FilesToggleProps = {
   files?: BranchFile[]
}

const extensionToIconClassMap = {
   ".file": "i-mdi-file",
   ".gitignore": "i-mdi-git",
   ".png": "i-mdi-image",
   ".txt": 'i-mdi-file-text',
   ".js": "i-mdi-language-javascript",
   ".jsx": "i-mdi-language-javascript",
   ".ts": "i-mdi-language-typescript",
   ".tsx": "i-mdi-language-typescript",
   ".md": "i-mdi-language-markdown",
   ".py": "i-mdi-language-python",
   ".java": "i-mdi-language-java",
   ".cpp": "i-mdi-language-cpp",
   ".css": "i-mdi-language-css3",
   ".cs": "i-mdi-language-csharp",
   ".html": "i-mdi-language-html5",
   ".php": "i-mdi-language-php",
   ".rb": "i-mdi-language-ruby",
   ".go": "i-mdi-language-go",
   ".swift": "i-mdi-language-swift",
   ".json": "i-mdi-code-json",
   ".xml": "i-mdi-xml",
   ".yaml": "i-mdi-xml",
   ".sql": "i-mdi-database",
   ".sh": "i-mdi-console",
   ".bat": "i-mdi-console",
   ".exe": "i-mdi-application",
   ".dll": "i-mdi-application",
   ".jar": "i-mdi-application",
}

export function FileSelector({ files }: FilesToggleProps) {

   const onDragStart = (file: BranchFile, event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('application/json', JSON.stringify(file))
      event.dataTransfer.effectAllowed = 'move';
      console.log("Drag started")
   }

   return (
      <>
         <Popover>
            <PopoverTrigger asChild>
               <Button className="flex space-x-2" variant="outline">
                  <FolderOpen className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  <span className="sr-only">Toggle Menu</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent className="z-10" align="start">
               <Command>
                  <CommandInput placeholder="Search..." />
                  <ScrollArea className="h-[300px]">
                     <CommandEmpty>No results found.</CommandEmpty>
                     <CommandGroup heading="Master branch">
                        {files?.map((file) => {

                           let iconClass = extensionToIconClassMap['.file'];

                           if (file.path) {
                              iconClass = getFileIconClass(file.path)
                           }

                           return (
                              <CommandItem onDragStart={(e) => onDragStart(file, e)} className="cursor-grab" draggable key={file.path}>
                                 <i className={`${iconClass} mr-2 h-4 w-4`} />
                                 <span>{file.path}</span>
                              </CommandItem>
                           )
                        })}
                     </CommandGroup>
                  </ScrollArea>
               </Command>
            </PopoverContent>
         </Popover>
      </>
   )
}
