import { createContext, useState, useContext, useRef } from "react";
import type { PropsWithChildren } from "react";
import { CreateProjectModal } from "../modals/CreateProjectModal";
import { InvitePeopleModal } from "../modals/InvitePeopleModal";
import ManageMembersModal from "../modals/ManageMembersModal";
import LeaveProjectModal from "../modals/LeaveProjectModal";

type ModalName = "inactive" | 'create-project' | 'invite-people' | 'manage-members' | 'leave-project'

export type ModalProps = PropsWithChildren<{
   open: boolean,
   onOpenStateChange: (open: boolean) => void
}>

type ModalProviderState = {
   modal: ModalName,
   data?: unknown,
   openModal: (modalName: ModalName, data?: unknown) => void,
}

const ModalContext = createContext<ModalProviderState>({ modal: 'inactive', openModal: () => { } })

export default function ModalProvider({ children }: PropsWithChildren) {
   const [modal, setModal] = useState<ModalName>('inactive')
   const dataRef = useRef<unknown>()

   const onOpenStateChange = (changedModal: ModalName, open: boolean) => {
      if (!open && changedModal == modal) {
         setModal('inactive')
      }
      else {
         setModal(changedModal)
      }
   }

   const openModal = (modal: ModalName, data? : unknown) => {
      setModal(modal);
      dataRef.current = data
  }

   const ModalMap = (ModalComponent: React.FC<ModalProps>, target: ModalName) => {
      return <>
         {modal == target && <ModalComponent open={modal == target} onOpenStateChange={(open) => onOpenStateChange(target, open)} />}
      </>
   }

   return (
      <ModalContext.Provider value={{ modal, data: dataRef.current, openModal }}>
         <>
            {children}
            {ModalMap(CreateProjectModal, 'create-project')}
            {ModalMap(InvitePeopleModal, 'invite-people')}
            {ModalMap(ManageMembersModal, 'manage-members')}
            {ModalMap(LeaveProjectModal, 'leave-project')}
         </>
      </ModalContext.Provider>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal<T>() {
   const modal = useContext(ModalContext);

   const closeModal = () => {
      modal.openModal('inactive')
   }
   
   return {
      ...modal,
      data: modal.data as T,
      closeModal,
   }
}