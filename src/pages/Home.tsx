import { useUser } from "@clerk/clerk-react"
import { Background, Controls, Node, ReactFlow, useNodesState } from 'reactflow'

import 'reactflow/dist/style.css';

const initialNodes: Node[] = []

export default function Home() {

   const { isSignedIn } = useUser()
   const [nodes, , onNodesChange] = useNodesState(initialNodes);

   if (!isSignedIn) {
      return null;
   }

   return (
      <>
         <div className="relative w-screen h-screen">
            <ReactFlow
               nodes={nodes}
               onNodesChange={onNodesChange}
               fitView
               attributionPosition="top-right"
            >
               <Controls position="bottom-right"/>
               <Background color="#000" gap={24} />
            </ReactFlow>
         </div>
      </>
   )
}