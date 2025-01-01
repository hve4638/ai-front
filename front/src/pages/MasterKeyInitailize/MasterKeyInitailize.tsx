import { useEffect, useState } from 'react';
import LocalAPI from 'api/local';
import SetupRecoveryKeyModal from './SetupRecoveryKeyModal';
import useSignal from 'hooks/useSignal';
import RecoveryModal from './RecoveryModal';

function MasterKeyInitailize({
    onFinished
}: { onFinished: () => void }) {
    const [refreshSignal, sendRefreshSignal] = useSignal();
    const [initializeMode, setInitializeMode] = useState(false);
    const [recoveryMode, setRecoveryMode] = useState(false);

    useEffect(() => {
        (async ()=>{
            setInitializeMode(false);
            setRecoveryMode(false);
            await LocalAPI.initMasterKey()
            const exists = await LocalAPI.isMasterKeyExists()
            if (!exists) {
                setInitializeMode(true);
                setRecoveryMode(false);
                return;
            }

            const isValid = await LocalAPI.validateMasterKey()
            if (!isValid) {
                setInitializeMode(false);
                setRecoveryMode(true);
                return;
            }

            setRecoveryMode(false);
            setInitializeMode(false);
            onFinished();
        })()
    }, [refreshSignal])

    return (
        <div>
        {
            initializeMode &&
            <SetupRecoveryKeyModal
                onSubmit={async (recoveryKey:string)=>{
                    await LocalAPI.generateMasterKey(recoveryKey);
                    return true;
                }}
                onClose = {()=>{
                    setInitializeMode(false);
                    sendRefreshSignal();
                }}
            />
        }
        {
            recoveryMode &&
            <RecoveryModal
                onRecovery={async (recoveryKey:string)=>{
                    const success = await LocalAPI.recoverMasterKey(recoveryKey);
                    return success;
                }}
                onReset={async ()=>{
                    await LocalAPI.resetMasterKey();
                }}
                onClose={()=>{
                    setRecoveryMode(false);
                    sendRefreshSignal();
                }}
            />
        }
        </div>
    );
}

export default MasterKeyInitailize;