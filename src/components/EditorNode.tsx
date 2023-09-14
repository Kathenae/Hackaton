import { ArrowDownRight, ArrowUpLeft, X } from 'lucide-react'
import { NodeProps } from "reactflow";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor'
import { useTheme } from "./providers/ThemeProvider";
import { cn, getFileIconClass } from '@/lib/utils';
import { EditorNodeData } from 'convex/schema';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

type EditorNodeProps = NodeProps<EditorNodeData>

export default function EditorNode({ data }: EditorNodeProps) {

   const [editorContent, setContent] = useState(data.content)
   const [isExpanded, setExpanded] = useState(data.expanded)
   const [isFocused, setIsFocused] = useState(false)
   const updateContent = useMutation(api.projects.updateEditorNode)
   const deleteNode = useMutation(api.projects.deleteEditorNode)
   const { theme, systemIsDark } = useTheme()
   const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

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

   const onClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault()

      deleteNode({ id: data._id })
   }

   const onChange = (newContent: string | undefined) => {
      setContent(newContent ?? '')
      
      if(editorRef.current){
         const editorTextPosition = editorRef.current.getPosition()
         updateContent({ id: data._id, content: newContent, textPosition: { 
            line: editorTextPosition?.lineNumber ?? 0, 
            column: editorTextPosition?.column ?? 0,
            scrollTop: editorRef.current.getScrollTop(),
            scrollLeft: editorRef.current.getScrollLeft(),
         }})
      }
   }

   const onToggleExpanded = () => {
      setExpanded(!isExpanded)
      updateContent({ id: data._id, expanded: !data.expanded })
   }

   useEffect(() => {
      if(!isFocused){
         setContent(data.content)

         if(data.textPosition && editorRef.current){
            editorRef.current.setPosition({ lineNumber: data.textPosition.line, column: data.textPosition.column })
            editorRef.current.setScrollTop(data.textPosition.scrollTop)
            editorRef.current.setScrollLeft(data.textPosition.scrollLeft)
         }
      }
   }, [data.content, data.textPosition, isFocused])

   useEffect(() => {
      setExpanded(data.expanded)
   }, [data.expanded])

   return (
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg relative group" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
         <header className="p-4 drag-handle relative">
            <h1 className='flex items-center space-x-2'>
               <i className={`${getFileIconClass(data.path ?? '')}`}/>
               <span>{data.path}</span>
            </h1>
            <Button variant={'ghost'} size={'icon'} className='absolute top-2 right-2' onClick={onClose}>
               <X className='text-gray-400 transition-all scale-75 hover:scale-100 cursor-pointer'/>
            </Button>
         </header>
         <div className={cn("transition-all", isExpanded ? "h-[400px] w-[700px]" : "w-[264px]")}>
            <Editor
               className={cn(
                  "cursor-auto transition-all border",
                  isExpanded ? "w-[700px] h-[400px] opacity-100" : "w-[264px] h-[0px] opacity-0 drag-handle"
               )}
               theme={(theme == 'dark' || (theme == 'system' && systemIsDark) ? 'vs-dark' : 'light')}
               value={!isFocused? data.content : editorContent}
               onChange={onChange}
               path={data.path ?? ''}
               beforeMount={onBeforeMount}
               onMount={(editor) => {
                  editorRef.current = editor
               }}
               line={100000}
               options={{
                  inlineSuggest: { enabled: true },
                  minimap: { enabled: false },
               }}
            />
         </div>
         <footer className='relative p-4 h-14 flex drag-handle'>
            <Button variant={'ghost'} size={'icon'} className='absolute top-2 right-2' onClick={onToggleExpanded}>
               {isExpanded && <ArrowUpLeft className='text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer' />}
               {!isExpanded && <ArrowDownRight className='text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer' />}
            </Button>
         </footer>
      </div>
   )
}