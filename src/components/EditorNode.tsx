import { ArrowDownRight, ArrowUpLeft, Loader2, X } from 'lucide-react'
import { NodeProps } from "reactflow";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor'
import { useTheme } from "./providers/ThemeProvider";
import { cn, getFileIconClass } from '@/lib/utils';
import { EditorNodeData, Project } from 'convex/schema';
import { useEffect, useRef, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

type EditorNodeProps = NodeProps<EditorNodeData & {project: Project}>

export default function EditorNode({ data }: EditorNodeProps) {

   const { toast } = useToast()
   const [editorContent, setContent] = useState(data.content)
   const [isExpanded, setExpanded] = useState(data.expanded)
   const [isFocused, setIsFocused] = useState(false)
   const [isCommiting, setIsCommiting] = useState(false)
   const [isLoading, setLoading] = useState(false)
   const [commitMessage, setCommitMessage] = useState("")
   const updateEditor = useMutation(api.projects.updateEditorNode)
   const deleteNode = useMutation(api.projects.deleteEditorNode)
   const commitFile = useAction(api.github.commitFile)
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

      if(isCommiting){
         setCommitMessage(newContent ?? '')
         return;
      }

      setContent(newContent ?? '')
      
      if(editorRef.current){
         const editorTextPosition = editorRef.current.getPosition()
         updateEditor({ id: data._id, content: newContent, textPosition: { 
            line: editorTextPosition?.lineNumber ?? 0, 
            column: editorTextPosition?.column ?? 0,
            scrollTop: editorRef.current.getScrollTop(),
            scrollLeft: editorRef.current.getScrollLeft(),
         }})
      }
   }

   const onCommit = async () => {
      setIsCommiting(true)
      setCommitMessage(`\n# Commiting to branch "${data.branch}". Please enter your commit message`)
      setTimeout(() => {
         editorRef.current?.setPosition({ lineNumber: 0, column: 0 })
      }, 100)
   }

   const onConfirm = async () => {
      try{
         setLoading(true)
         if(!data.project.owner){
            return;
         }
   
         const messageWithoutComments = commitMessage.replace(/^#.*$/gm, '');
         const response = await commitFile({
            id: data._id,
            username: data.project.owner?.username,
            repo: data.project.repo,
            branch: data.branch,
            filepath: data.path,
            fileContent: data.content,
            message: messageWithoutComments,
            sha: data.sha, 
         })
   
         if(response && (response.status == 200 || response.status == 201)){
            setIsCommiting(false)
            setCommitMessage('')
            toast({
               title: 'Commit Sent',
               description: `Commited "${data.path}" to "${data.branch}" branch successfully`,
               duration: 3000,
            })
         }
      }
      catch(error){
         console.error(error)
      }
      finally{
         setLoading(false)
      }
   }

   const onCancel = async () => {
      setIsCommiting(false)
   }

   const onToggleExpanded = () => {
      setExpanded(!isExpanded)
      updateEditor({ id: data._id, expanded: !data.expanded })
   }

   const chooseContent = () => {
      if (isCommiting) {
         return commitMessage;
      }

      if (isFocused) {
         return editorContent
      }
      else {
         return data.content
      }
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
               value={chooseContent()}
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
         <footer className={cn(
            'relative px-4 h-14 flex items-center space-x-2 cursor-default',
            !isExpanded && 'drag-handle cursor-grab'
         )}>
            {isExpanded && isCommiting &&
               <>
                  <Button className='flex items-center space-x-2' disabled={isLoading} onClick={onConfirm} size={'sm'} variant={'outline'}>
                     <span>Confirm</span>
                     {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </Button>
                  <Button disabled={isLoading} onClick={onCancel} size={'sm'} variant={'destructive'}>Cancel</Button>
               </>
            }
            {isExpanded && !isCommiting &&
               <>
                  <Button onClick={onCommit} size={'sm'} variant={'outline'}>Commit</Button>
               </>
            }
            <Button variant={'ghost'} size={'icon'} className='absolute top-2 right-2' onClick={onToggleExpanded}>
               {isExpanded && <ArrowUpLeft className='text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer' />}
               {!isExpanded && <ArrowDownRight className='text-gray-400 transition-all hidden group-hover:block scale-75 hover:scale-100 cursor-pointer' />}
            </Button>
         </footer>
      </div>
   )
}