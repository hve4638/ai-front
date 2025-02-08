import { useEffect, useState } from 'react';
import { MODAL_DISAPPEAR_DURATION } from 'data';

function useModalDisappear(onClose:()=>void) {
    const [disappear, setDisappear] = useState(true);

    useEffect(()=>{
        // 초기 랜더링 시 페이드인 효과를 위해 1ms 후 false로 변경
        // 즉시 변경시 css 효과가 적용되지 않음
        const t = window.setTimeout(()=>{
            setDisappear(false);
        }, 1);
        return ()=>{
            window.clearTimeout(t);
        };
    }, []);

    const close = ()=>{
        setDisappear(true);
        window.setTimeout(()=>{
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    return [disappear, close] as [boolean, ()=>void];
}


export default useModalDisappear;