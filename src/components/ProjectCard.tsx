import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "../../convex/schema";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";


type ProjectCardProps = {
   project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {

   const deleteProject = useMutation(api.projects.deleteProject)

   const onDelete = () => {
      deleteProject({ id: project._id })
   }

   return (
      <>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="font-medium">
                  <Link className="hover:underline" to={`/project/${project._id}`}>{project.name}</Link>
               </CardTitle>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant='ghost' size='icon'>
                        <MoreVertical />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                     <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </CardHeader>
            <CardContent>
               <small className="flex items-center text-gray-400 space-x-2">
                  <i className="i-mdi-github h-4 w-4"/>
                  <span>{project.repo}</span>
               </small>
               <div className="mt-4">
                  <span className="rounded-full border-primary border px-4 font-medium text-primary inline-block mr-2 mb-2">React</span>
                  <span className="rounded-full border-primary border px-4 font-medium text-primary inline-block mr-2 mb-2">Typescript</span>
                  <span className="rounded-full border-primary border px-4 font-medium text-primary inline-block mr-2 mb-2">Javascript</span>
                  <span className="rounded-full border-primary border px-4 font-medium text-primary inline-block mr-2 mb-2">Another One</span>
               </div>
            </CardContent>
         </Card>
      </>
   )
}