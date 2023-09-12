import { TooltipContent } from "@radix-ui/react-tooltip";
import { UserAvatar } from "./UserAvatar";
import { ScrollAreaHorizontal } from "./ui/scroll-area-horizontal";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useStoredUser } from "./providers/StoredUserProvider";

type MemberListProps = {
   project: ReturnType<typeof useQuery<typeof api.projects.getForUser>>
}

export default function MembersList({ project }: MemberListProps) {

   const { userId } = useStoredUser()

   function wasLastSeenRecently(lastSeenTimestamp : string) {
      const lastSeenDate = new Date(lastSeenTimestamp) 
      const fiveMinutesAgo = new Date(new Date().getTime() - 1 * 60 * 1000);
      return lastSeenDate >= fiveMinutesAgo
   }

   return (
      <ScrollAreaHorizontal className="max-w-[400px] pl-2 pr-4">
         <div className="flex space-x-4">
            {project?.members.filter(m => wasLastSeenRecently(m.user?.lastSeenTimestamp ?? '') && m.userId !== userId).map((member) => (
               <TooltipProvider key={member._id}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <button className="relative">
                           <UserAvatar src={member.user?.avatarUrl} />
                           <div className='absolute bottom-0 right-0 rounded-full w-[12px] h-[12px] bg-green-500' />
                        </button>
                     </TooltipTrigger>
                     <TooltipContent>
                        {member.user?.name}
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            ))}
         </div>
      </ScrollAreaHorizontal>
   )
}