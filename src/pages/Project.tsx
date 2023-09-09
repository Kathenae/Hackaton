import { MenuToggle } from "@/components/MenuToggle";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton, useUser } from "@clerk/clerk-react"
import { Background, Controls, Node, ReactFlow, useNodesState } from 'reactflow'
import { Id } from "../../convex/_generated/dataModel"
import { api } from "../../convex/_generated/api";
import 'reactflow/dist/style.css';
import { useParams } from "react-router-dom";
import { useQuery, } from "convex/react";
import { useEffect, useRef } from "react";
import * as github from "@/lib/github";

const initialNodes: Node[] = []

export default function Project() {

   const { isSignedIn } = useUser()
   const { id } = useParams<{ id: string }>()
   const project = useQuery(api.projects.get, { id: id as Id<"projects"> })
   const [nodes, , onNodesChange] = useNodesState(initialNodes);
   const { theme, systemIsDark } = useTheme()
   const repoFiles = useRef<github.BranchFile[]>()

   useEffect(() => {
      (
         async function () {
            if (project) {
               const files = await github.listBranchFiles({ username: project.owner, repo: project.repo, branch: 'master' });
               repoFiles.current = files;
            }
         })()
   }, [project])

   if (!isSignedIn) {
      return null;
   }

   return (
      <>
         <div className="relative w-screen h-screen bg-dark-400">
            <ReactFlow
               nodes={nodes}
               onNodesChange={onNodesChange}
               fitView
               attributionPosition="bottom-left"
            >
               <Controls position="bottom-right" />
               <Background color={theme == 'dark' || (theme == 'system' && systemIsDark) ? '#fff' : '#000'} gap={16} />
            </ReactFlow>

            <div className="absolute p-2 space-x-2 top-0 left-0 flex">
               <MenuToggle />
            </div>

            <div className="absolute p-2 space-x-2 top-0 right-0 flex items-center">
               <ModeToggle />
               <UserButton />
            </div>
         </div>
      </>
   )
}