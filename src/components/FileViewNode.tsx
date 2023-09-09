import { ArrowDownRight, ArrowUpLeft, X } from 'lucide-react'
import { BranchFile, getRepoFileContent } from "@/lib/github";
import { NodeProps, useReactFlow } from "reactflow";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "./providers/ThemeProvider";
import { useEffect, useState } from "react";
import { cn, getFileIconClass } from '@/lib/utils';

type FileViewMNodeProps = NodeProps<BranchFile>

export default function FileViewMNode({ id, data }: FileViewMNodeProps) {

   const { theme, systemIsDark } = useTheme()
   const [content, setContent] = useState()
   const [isExpanded, setExpanded] = useState(true)
   const {setNodes} = useReactFlow()

   function onBeforeMount(monaco: Monaco) {
      // here is the monaco instance
      // do something before editor is mounted
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ jsx: monaco.languages.typescript.JsxEmit.ReactJSX })
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
         noSemanticValidation: true,
         noSyntaxValidation: true,
         diagnosticCodesToIgnore: [2792, 17004],
      });

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ jsx: monaco.languages.typescript.JsxEmit.ReactJSX })
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
         noSemanticValidation: true,
         noSyntaxValidation: true,
         diagnosticCodesToIgnore: [2792, 17004],
      });
   }

   useEffect(() => {
      (async function () {
         if (data.path) {
            const branchFile = await getRepoFileContent({ username: data.owner, repo: data.repository, path: data.path })

            if (typeof branchFile === 'string') {
               setContent(branchFile)
            }
         }
      })()
   }, [data])

   const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
   }

   const onClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      console.log(event)
      event.preventDefault()
      setNodes((current) => (current.filter((n) => n.id !== id)))
   }

   return (
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg relative group" onKeyDown={onKeyDown}>
         <header className="p-4 drag-handle relative">
            <h1 className='flex items-center space-x-2'>
               <i className={`${getFileIconClass(data.path ?? '')}`}/>
               <span>{data.path}</span>
            </h1>
            <button onClick={onClose}>
               <X className='absolute top-4 right-4 scale-75 text-gray-400 cursor-pointer' />
            </button>
         </header>
         <div className={cn("transition-all", isExpanded ? "h-[400px] w-[700px]" : "w-[264px]")}>
            <Editor
               className={cn(
                  "cursor-auto transition-all border",
                  isExpanded ? "w-[700px] h-[400px] opacity-100" : "w-[264px] h-[0px] opacity-0 drag-handle"
               )}
               theme={(theme == 'dark' || (theme == 'system' && systemIsDark) ? 'vs-dark' : 'light')}
               value={content}
               path={data.path ?? ''}
               beforeMount={onBeforeMount}
               options={{
                  inlineSuggest: { enabled: true },
                  minimap: { enabled: false },
               }}
            />
         </div>
         <footer className='p-4 h-14 flex drag-handle'>
            {isExpanded && <ArrowUpLeft onClick={() => setExpanded(!isExpanded)} className='ml-auto text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer bottom-4 right-1' />}
            {!isExpanded && <ArrowDownRight onClick={() => setExpanded(!isExpanded)} className='ml-auto text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer bottom-4 right-1' />}
         </footer>
      </div>
   )
}