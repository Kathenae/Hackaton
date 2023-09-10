import { createContext, useState, useContext } from "react";
import type { PropsWithChildren } from "react";
import { CreateProjectModal } from "../modals/CreateProjectModal";
import { InvitePeopleModal } from "../modals/InvitePeopleModal";

type ModalName = "inactive" | 'create-project' | 'invite-people'

export type ModalProps = {
   open: boolean,
   onOpenStateChange: (open: boolean) => void
}

type ModalProviderState = {
   modal: ModalName,
   data?: unknown,
   openModal: (modalName: ModalName, data?: unknown) => void,
}

const ModalContext = createContext<ModalProviderState>({ modal: 'inactive', openModal: () => { } })

export default function ModalProvider({ children }: PropsWithChildren) {
   const [modal, setModal] = useState<ModalName>('inactive')
   const [data, setData] = useState<unknown>();

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
      setData(data);
  }

   const ModalMap = (ModalComponent: React.FC<ModalProps>, target: ModalName) => {
      return <>
         {modal == target && <ModalComponent open={modal == target} onOpenStateChange={(open) => onOpenStateChange(target, open)} />}
      </>
   }

   return (
      <ModalContext.Provider value={{ modal, data, openModal }}>
         <>
            {children}
            {ModalMap(CreateProjectModal, 'create-project')}
            {ModalMap(InvitePeopleModal, 'invite-people')}
         </>
      </ModalContext.Provider>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
   const modal = useContext(ModalContext);

   const closeModal = () => {
      modal.openModal('inactive')
   }
   
   return {
      ...modal,
      closeModal,
   }
}