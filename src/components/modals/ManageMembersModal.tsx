import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTrigger,
   DialogTitle
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalProps } from '../providers/ModalProvider';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Member } from '../../../convex/schema';
import { UserAvatar } from '../UserAvatar';
import { useParams } from 'react-router-dom';

export default function ManageMembersModal({ open, onOpenStateChange, children }: ModalProps) {

   const [loadingId, setLoadingId] = useState<string | false>(false)
   const { id } = useParams()
   const project = useQuery(api.projects.getForUser, {id: id as Id<'projects'>})
   const removeMember = useMutation(api.members.remove)

   const onRemove = async (member: Member) => {
      try {
         setLoadingId(member._id)
         await removeMember({ id: member._id })
      }
      catch (error) {
         console.error(error)
      }
      finally {
         setLoadingId(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogTrigger asChild>
            {children}
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle className='text-center'>Manage Members</DialogTitle>
               <DialogDescription className='text-center'>
                  {project?.members?.length} Members
               </DialogDescription>
            </DialogHeader>
            <ScrollArea className='mt-8 max-h-[420px] pr-6'>
               {project?.members?.map((member) => (
                  <div key={member._id} className='flex items-center gap-x-2 mb-6'>
                     <UserAvatar src={member.user?.avatarUrl} />
                     <div className="flex flex-col gap-y-2">
                        <div className="font-semibold flex items-center">
                           <span className='mr-2'>{member.user?.username}</span>
                        </div>
                     </div>
                     {(project.ownerId !== member.user?._id && loadingId !== member._id) &&
                        <div className='ml-auto'>
                           <DropdownMenu>
                              <DropdownMenuTrigger>
                                 <i className='i-lucide-more-vertical h-4 w-4 text-zinc-500' />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side='right'>
                                 <DropdownMenuItem onClick={() => onRemove(member)} className='cursor-pointer'>
                                    <i className='i-lucide-gavel h-4 w-4' />
                                    <span className='ml-2'>Remove</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     }
                     {loadingId === member._id &&
                        <i className='i-lucide-loader-2 h-4 w-4 animate-spin ml-auto' />
                     }
                  </div>
               ))}
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}
