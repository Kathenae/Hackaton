import { MenuToggle } from "@/components/MenuToggle";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/clerk-react"
import { Background, BackgroundVariant, Node, ReactFlow, useNodesState, useReactFlow } from 'reactflow'
import { Id } from "../../convex/_generated/dataModel"
import { api } from "../../convex/_generated/api";
import 'reactflow/dist/style.css';
import { useParams } from "react-router-dom";
import { useMutation, useQuery, } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import {Branch, BranchFile, Branches, getMainBranch, getRepoFileContent, listBranchFiles, listBranches} from "@/lib/github";
import { FileSelector } from "@/components/FileSelector";
import BranchSelector from "@/components/BranchSelector";
import EditorNode from "@/components/EditorNode";
import Controls from "@/components/Controls";
import MembersList from "@/components/MembersList";
import { router } from "@/routes";
import { EditorNodeData } from "convex/schema";
import { Loader2 } from "lucide-react";

const initialNodes: Node[] = []
const nodeTypes = {
   editor: EditorNode
}

export default function ProjectPage() {

   const { id } = useParams<{ id: string }>()
   const project = useQuery(api.projects.getForUser, { id: id as Id<"projects"> })
   const createEditorNode = useMutation(api.projects.createEditorNode)
   const updateEditorNode = useMutation(api.projects.updateEditorNode)

   const [nodes, , onNodesChange] = useNodesState(initialNodes);
   const { theme, systemIsDark } = useTheme()
   const [branches, setBranches] = useState<Branches>()
   const [currentBranch, setCurrentBranch] = useState<Branch>()
   const [repoFiles, setRepoFiles] = useState<BranchFile[]>()
   const { setNodes, project: projectPosition, getNode, getZoom } = useReactFlow()
   
   // On Project changes
   useEffect(() => {
      (
         async function () {
            if(project === null){
               // Project is invalid, return home
               router.navigate('/')
               return;
            }

            if (project && project.owner) {
               const { data: branches } = await listBranches({ username: project.owner.username, repo: project.repo })
               let branch = getMainBranch(branches)

               if(!currentBranch){
                  setCurrentBranch(branch)
               }
               else{
                  branch = currentBranch
               }

               // if we have a branch
               if (branch) {
                  const files = await listBranchFiles({ username: project.owner?.username, repo: project.repo, branch: branch.name });
                  setRepoFiles(files);
                  setBranches(branches)
               }
               else{
                  alert('Unable to load the main branch from this repo')
               }
            }
         })()
   }, [project, currentBranch])

   // Render editor nodes
   useEffect(() => {
      (
         async () => {
            if(project?.editorNodes){
               const nodes = project.editorNodes.filter(editor => editor.branch === currentBranch?.name).map((editor) => {
                  const position = editor.position;
                  return {
                     id: editor._id,
                     type: 'editor',
                     position: position,
                     dragHandle: '.drag-handle',
                     data: editor,
                  }
               });
               setNodes(nodes)
            }
         }
      )()
   }, [id, project, currentBranch, setNodes, getNode])

   const onDragOver = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    }, [])

   const onDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const dropItem = event.dataTransfer.getData('application/json')
      const file = JSON.parse(dropItem) as BranchFile
      const path = file.path ?? '';
      const position = projectPosition({
         x: event.clientX,
         y: event.clientY,
      });

      if(!project){
         alert('Project not loaded')
         return;
      }

      // Check if there's already an editor node for this file
      if(project.editorNodes.find(e => e.path === path && e.branch === currentBranch?.name)){
         alert('Editor for this file already added, select the branch if you do not see it in your viewport');
         return
      }

      if(!currentBranch){
         alert('Branch not selected');
         return
      }

      const content = await getRepoFileContent({ username: file.owner, repo: file.repository, path, branchName: currentBranch.name })

      if (typeof content === 'string') {
         await createEditorNode({ 
            projectId: project._id, 
            content, 
            branch: currentBranch.name, 
            sha: file.sha, 
            position, 
            path,
         })
      }

   }, [project, currentBranch, createEditorNode, projectPosition])

   const onNodeDragStart = (event: React.MouseEvent<Element, MouseEvent>, node: Node<EditorNodeData, string | undefined>) => {
      event.preventDefault();
      console.log(node.position)
   }

   const onNodeDragStop = (event: React.MouseEvent<Element, MouseEvent>, node: Node<EditorNodeData, string | undefined>) => {
      event.preventDefault();
      updateEditorNode({ id: node.data._id, position: node.position })
   }

   const onBranchSelected = (branch: Branch | undefined) => {
      if(branch){
         setCurrentBranch(branch)
      }
   }

   // Still loading project
   if(project === undefined){
      return (
         <div className="w-screen h-screen flex items-center justify-center">
            <Loader2 className="text-neutral-700 h-32 w-32 animate-spin" />
         </div>
      )
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
               minZoom={0.2}
               maxZoom={1.0}
               fitView
               fitViewOptions={{minZoom: 1.0}}
               defaultViewport={{x: 0, y: 0, zoom: getZoom()}}
               onNodeDragStart={onNodeDragStart}
               onNodeDragStop={onNodeDragStop}
            >
               <Background lineWidth={1} variant={BackgroundVariant.Dots} color={theme == 'dark' || (theme == 'system' && systemIsDark) ? '#888' : '#888'} gap={32} />
               <Controls />
            </ReactFlow>


            <div className="absolute p-2 space-x-2 top-0 left-0 flex">
               <MenuToggle project={project}/>
               <BranchSelector 
                  branches={branches} 
                  repository={project?.repo} 
                  currentBranch={currentBranch}
                  onBranchSelected={onBranchSelected} 
               />
               <FileSelector files={repoFiles}/>
            </div>

            <div className="absolute p-2 space-x-2 top-0 right-0 flex items-center">
               <ModeToggle />
               <UserButton />
            </div>

            <div className="absolute top-0 left-96 p-2">
               <MembersList project={project} />
            </div>
         </div>
      </>
   )
}