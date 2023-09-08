import { createContext, useState, useContext } from "react";
import type { PropsWithChildren } from "react";
import { CreateProjectModal } from "../modals/CreateProjectModal";

type ModalName = "inactive" | 'create-project'

export type ModalProps = {
   open: boolean,
   onOpenStateChange: (open: boolean) => void
}

type ModalProviderState = {
   modal: ModalName,
   setModal: (modalName: ModalName) => void,
}

const ModalContext = createContext<ModalProviderState>({ modal: 'inactive', setModal: () => { } })

export default function ModalProvider({ children }: PropsWithChildren) {
   const [modal, setModal] = useState<ModalName>('inactive')

   const handleToggleModal = (changedModal: ModalName, open: boolean) => {
      if (!open && changedModal == modal) {
         setModal('inactive')
      }
      else {
         setModal(changedModal)
      }
   }

   return (
      <ModalContext.Provider value={{ modal, setModal }}>
         {children}
         {modal == 'create-project' && <CreateProjectModal open={modal == 'create-project'} onOpenStateChange={(open) => handleToggleModal('create-project', open)} />}
      </ModalContext.Provider>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal(){
   return useContext(ModalContext)
}