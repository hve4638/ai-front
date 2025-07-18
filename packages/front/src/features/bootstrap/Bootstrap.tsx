import { useEffect, useMemo } from 'react';
import useBootStore from './useBootStore';
import useSignal from '@/hooks/useSignal';
import { BeginPhase, BootCompletePhase, LoadGlobalDataPhase, MasterKeyInitializePhase, MigrationPhase } from './phase';

const BOOT: React.ReactNode[] = [
    <BeginPhase />,
    <MasterKeyInitializePhase />,
    <MigrationPhase />,
    <LoadGlobalDataPhase />,
    <BootCompletePhase />,
];

function Bootstrap() {
    const bootState = useBootStore();
    
    const node = useMemo(() => {
        if (bootState.phase < 0 || bootState.phase >= BOOT.length) {
            return <></>;
        }
        else {
            return BOOT[bootState.phase];
        }
    }, [bootState.phase]);

    return node;
}

export default Bootstrap;