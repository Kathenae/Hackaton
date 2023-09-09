import { useModal } from "@/components/providers/ModalProvider";
import { router } from "@/routes";
import { api } from '../../convex/_generated/api'
import { useQuery } from "convex/react";
import { useEffect } from "react";

import 'reactflow/dist/style.css';

export default function HomePage() {

   const { openModal } = useModal()
   const userProjects = useQuery(api.projects.listForUser)

   useEffect(() => {
      async function load() {
         if (userProjects) {
            if (userProjects.length <= 0) {
               openModal('create-project')
            }
            else {
               router.navigate(`/project/${userProjects[0]._id}`)
            }
         }
      }
      load()
   }, [userProjects, openModal])

   return (
      <>
         <div className="relative w-screen h-screen">

         </div>
      </>
   )
}