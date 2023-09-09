import { MenuToggle } from "@/components/MenuToggle";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton, useUser } from "@clerk/clerk-react"
import { Background, Controls, Node, ReactFlow, useNodesState, useReactFlow } from 'reactflow'
import { Id } from "../../convex/_generated/dataModel"
import { api } from "../../convex/_generated/api";
import 'reactflow/dist/style.css';
import { useParams } from "react-router-dom";
import { useQuery, } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import {BranchFile, listBranchFiles} from "@/lib/github";
import { FileSelector } from "@/components/FileSelector";
import BranchSelector from "@/components/BranchSelector";
import EditorNode from "@/components/EditorNode";
import { createFileNode } from "@/lib/utils";

const initialNodes: Node[] = []
const nodeTypes = {
   editor: EditorNode
}

export default function ProjectPage() {

   const { isSignedIn } = useUser()
   const { id } = useParams<{ id: string }>()
   const project = useQuery(api.projects.get, { id: id as Id<"projects"> })
   const [nodes, , onNodesChange] = useNodesState(initialNodes);
   const { theme, systemIsDark } = useTheme()
   const [repoFiles, setRepoFiles] = useState<BranchFile[]>()
   const { setNodes, project: projectPosition } = useReactFlow()
   
   useEffect(() => {
      (
         async function () {
            if (project && !repoFiles) {
               const files = await listBranchFiles({ username: project.owner, repo: project.repo, branch: 'master' });
               setRepoFiles(files);
            }
         })()
   }, [project, repoFiles])

   const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    }, [])

   const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const dropItem = event.dataTransfer.getData('application/json')
      const file = JSON.parse(dropItem) as BranchFile
      const path = file.path ?? '';
      const position = projectPosition({
         x: event.clientX,
         y: event.clientY,
      });

      const fileNode = createFileNode(file, position)

      if(path){
         setNodes((current) => [...current, fileNode])
      }
   }, [setNodes, projectPosition])

   if (!isSignedIn) {
      return null;
   }

   return (
      <>
         <div className="w-screen h-screen overflow-hidden bg-dark-400">
            <ReactFlow
               nodes={nodes}
               nodeTypes={nodeTypes}
               onNodesChange={onNodesChange}
               proOptions={{ hideAttribution: true }}
               onDragOver={onDragOver}
               onDrop={onDrop}
            >
               <Background color={theme == 'dark' || (theme == 'system' && systemIsDark) ? '#fff' : '#000'} gap={32} />
               <Controls position="bottom-right" />
            </ReactFlow>


            <div className="absolute p-2 space-x-2 top-0 left-0 flex">
               <MenuToggle />
               <BranchSelector repository={project?.repo}/>
               <FileSelector files={repoFiles}/>
            </div>

            <div className="absolute p-2 space-x-2 top-0 right-0 flex items-center">
               <ModeToggle />
               <UserButton />
            </div>
         </div>
      </>
   )
}