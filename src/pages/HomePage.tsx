import { useModal } from "@/components/providers/ModalProvider";
import { api } from '../../convex/_generated/api'
import { useQuery } from "convex/react";

import 'reactflow/dist/style.css';
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/clerk-react";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {

   const { openModal } = useModal()
   const userProjects = useQuery(api.projects.listForUser)

   return (
      <>
         <div className="relative w-screen h-screen bg-gray-50 dark:bg-zinc-950 overflow-y-auto">
            <div>
               <div className="relative p-4 z-10">

                  <div className="fixed top-0 left-0 w-full">
                     <div className="p-4">
                        <div className="p-4 rounded-md border shadow flex items-center bg-background w-full">
                           <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                           <div className="ml-auto items-center flex space-x-2">
                              <ModeToggle />
                              <UserButton />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-32">
                     <div className="mb-16">
                        <div className="flex items-center mb-4">
                           <h2 className="text-3xl font-bold tracking-tight">Your Projects</h2>
                           <div className="flex items-center space-x-2 ml-auto">
                              <Button onClick={() => openModal('create-project')} size='lg'>New Project</Button>
                           </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                           {userProjects?.map((project) => (
                              <ProjectCard key={project._id} project={project}/>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}