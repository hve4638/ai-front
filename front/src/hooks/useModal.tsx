import { createContext, useContext, useRef, useState } from 'react';

// Modal은 isFocuse와 onClose props를 필수로 받아야 한다.
type ModalComponentType<P = {}> = React.ComponentType<{ onClose:()=>void, isFocused: boolean } & P>;

interface ModalContextType {
    // props에서는 onClose, isFocused를 제외한 나머지 props를 받는다.
    open: <P extends {}>(modal:ModalComponentType<P>, props:Omit<P, 'onClose'|'isFocused'>)=>void;
    count:number;
}

type ModalData = {
    component:ModalComponentType<any>;
    props:any;
    key:any;
}

const ModalContext = createContext<ModalContextType|null>(null);

export function useModal() {
    const modalContext = useContext(ModalContext);

    if (!modalContext) {
        throw new Error('ModalContext is not provided');
    }
    return modalContext;
}

export function ModalProvider({children}: {children:React.ReactNode}) {
    const counter = useRef(0);
    const [modals, setModals] = useState<ModalData[]>([]);

    const openModalLegacy = <P extends {}>(modal:ModalComponentType<P>, props:Omit<P, 'onClose'|'isFocused'>) => {
        const data:ModalData = {
            component:modal,
            key: counter.current++,
            props: props,
        }
        setModals((prev)=>[...prev, data]);
    }

    return (
        <ModalContext.Provider value={{
            open : openModalLegacy,
            count : modals.length,
        }}>
            {children}
            {
                modals.map(({component : Modal, key, props}, index)=>(
                    <Modal
                        key={key}
                        {...props}
                        isFocused={index === modals.length - 1}
                        onClose={
                            ()=>setModals((prev)=>prev.filter((d)=>d.key !== key))
                        }
                    />
                ))
            }
        </ModalContext.Provider>
    )
}