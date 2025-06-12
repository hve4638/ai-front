import { useEffect } from 'react';
import { BootResult } from './type';
import useBootStore from '../useBootStore';

function BootCompletePhase() {
    const { update } = useBootStore();

    useEffect(()=>{
        update.booted(true);
    }, [])

    return (
        <div></div>
    );
}

export default BootCompletePhase;