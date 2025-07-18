import { useEffect, useState } from 'react';
import LocalAPI from 'api/local';
import SetupRecoveryKeyModal from './SetupRecoveryKeyModal';
import useSignal from 'hooks/useSignal';
import RecoveryModal from './RecoveryModal';

function MasterKeyProcess({
    onFinished
}: { onFinished: () => void }) {
    const [refreshSignal, sendRefreshSignal] = useSignal();
    const [resetMode, setResetMode] = useState(false);
    const [recoveryMode, setRecoveryMode] = useState(false);
    const [forceReset, setForceReset] = useState(false);

    useEffect(() => {
        (async ()=>{
            setResetMode(false);
            setRecoveryMode(false);
            if (forceReset) {
                setForceReset(false);
                setResetMode(true);
                setForceReset(false);
                return;
            }

            const masterKeyState = await LocalAPI.masterKey.init()
            switch (masterKeyState) {
                case 'no-data':
                case 'invalid-data':
                    setResetMode(true);
                    setRecoveryMode(false);
                    return;
                case 'need-recovery':
                    setResetMode(false);
                    setRecoveryMode(true);
                    return;
                case 'normal':
                    setResetMode(false);
                    setRecoveryMode(false);
                    onFinished();
                    return;
            }
        })()
    }, [refreshSignal])

    return (
        <div>
        {
            resetMode &&
            <SetupRecoveryKeyModal
                onSubmit={async (recoveryKey:string)=>{
                    await LocalAPI.masterKey.reset(recoveryKey);
                    return true;
                }}
                onClose = {()=>{
                    setResetMode(false);
                    sendRefreshSignal();
                }}
            />
        }
        {
            recoveryMode &&
            <RecoveryModal
                onRecovery={async (recoveryKey:string)=>{
                    const success = await LocalAPI.masterKey.recover(recoveryKey);
                    return success;
                }}
                onReset={async ()=>{
                    setForceReset(true);
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

export default MasterKeyProcess;