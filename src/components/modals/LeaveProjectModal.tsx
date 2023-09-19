import { useMutation, useQuery } from 'convex/react';
import { ModalProps, useModal } from '../providers/ModalProvider';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { router } from '@/routes';

export default function LeaveProjectModal({ open, onOpenStateChange, children }: ModalProps) {

   const { data: project, closeModal } = useModal<ReturnType<typeof useQuery<typeof api.projects.getForUser>>>()
   const leaveProject = useMutation(api.members.leave)

   const onConfirm = async (confirmed: boolean) => {

      if (!confirmed) {
         console.log('Not confirmed')
         closeModal()
         return;
      }
      
      const response = await leaveProject({ projectId: project?._id as Id<'projects'> })
      if(!response?.error){
         closeModal()
         router.navigate('/')
      }
      else{
         console.error(response.error)
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenStateChange}>
         <DialogTrigger asChild>
            {children}
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle className='text-center'>Leave Project</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
               Are you sure you want to leave <span className='text-indigo-500 font-semibold'>{project?.name}</span> ?
            </div>
            <DialogFooter className='flex items-center'>
               <div className='flex items-center w-full justify-between'>
                  <Button variant='ghost' onClick={() => onConfirm(false)}>Cancel</Button>
                  <Button onClick={() => onConfirm(true)}>Confirm</Button>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
