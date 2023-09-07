import { MenuToggle } from "@/components/MenuToggle";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";
import { useUser } from "@clerk/clerk-react"
import { Background, Controls, Node, ReactFlow, useNodesState } from 'reactflow'

import 'reactflow/dist/style.css';

const initialNodes: Node[] = []

export default function Home() {

   const { isSignedIn } = useUser()
   const [nodes, , onNodesChange] = useNodesState(initialNodes);
   const { theme, systemIsDark } = useTheme()

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
               <Controls position="bottom-right"/>
               <Background color={theme == 'dark' || (theme == 'system' && systemIsDark)? '#fff' : '#000'} gap={16} />
            </ReactFlow>
            <div className="absolute p-2 space-x-2 top-0 left-0 flex">
               <MenuToggle />
            </div>

            <div className="absolute p-2 top-0 right-0 flex">
               <ModeToggle />
            </div>
         </div>
      </>
   )
}