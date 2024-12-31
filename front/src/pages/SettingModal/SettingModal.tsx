import { useEffect, useState } from 'react';
import { Modal, ModalHeader } from 'components/Modal';
import {
    GeneralOptions,
    APIKeyOptions,
    HistoryOptions,
    ServerOptions,
    DataOptions,
    ModelOptions,
    ShortcutOptions,
} from './options';

const SETTING_CATEGORY = {
    GENERAL : '일반',
    API : 'API',
    MODELS : '모델',
    SHORTCUT : '단축키',
    SESSION : '세션',
    HISTORY : '기록',
    SERVER : '서버 (베타)',
    DATA : '데이터',
}
type SETTING_CATEGORY = typeof SETTING_CATEGORY[keyof typeof SETTING_CATEGORY];


type SettingModalProps = {
    onClose:() => void;
}

function SettingModal({
    onClose,
}:SettingModalProps) {
    const categories = [
        SETTING_CATEGORY.GENERAL,
        SETTING_CATEGORY.MODELS,
        SETTING_CATEGORY.API,
        SETTING_CATEGORY.SHORTCUT,
        SETTING_CATEGORY.HISTORY,
        SETTING_CATEGORY.SERVER,
        SETTING_CATEGORY.DATA,
    ]
    const [disappear, setDisappear] = useState(true);
    const [currentCategory, setCurrentCategory] = useState<SETTING_CATEGORY>(SETTING_CATEGORY.GENERAL);
    
    const onExit = () => {
        setDisappear(true);
        setTimeout(() => {
            onClose();
        }, 200);
    }

    useEffect(() => {
        const keyDownHandler = (e)=>{
            if (e.key === 'Escape') {
                onExit();
            }
        }
        setTimeout(() => {
            setDisappear(false);
        }, 0);

        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        }
    }, []);

    useEffect(()=>{
        const keyDownHandler = (e)=>{
            console.log(e.key);
        }
        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        }
    })
    
    return (
        <Modal
            disappear={disappear}
            style={{
                height: '80%',
                maxHeight: '80%',
            }}
        >
            <div
                style={{
                    position : 'relative',
                    display: 'grid',
                    gridTemplateRows: '64px 1fr',
                    gridTemplateColumns: '96px 1fr',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div>
                </div>
                <div>
                    <ModalHeader
                        title={currentCategory}
                        onClose={onExit}
                    />
                </div>
                <div
                    className='undraggable'
                    style={{
                        display: 'block',
                        fontSize: '0.9em'
                    }}
                >
                    {
                        categories.map((category, index) => (
                            <div
                                className={
                                    'setting-category' +
                                    (currentCategory === category ? ' selected' : '')
                                }
                                key={index}
                                style={{
                                    width: '100%',
                                    margin: '0px',
                                    cursor: 'pointer',
                                }}
                                onClick={()=>{
                                    setCurrentCategory(category);
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '0.95em',
                                    }}
                                >
                                    {category}
                                </span>
                            </div>
                        ))
                    }
                </div>
                <div
                    style={{
                        display: 'block',
                        overflowY: 'auto',
                        padding: '0px 8px',
                        fontSize: '1.0em',
                    }}
                >
                {
                    currentCategory === SETTING_CATEGORY.GENERAL &&
                    <GeneralOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.MODELS &&
                    <ModelOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.API &&
                    <APIKeyOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.SHORTCUT &&
                    <ShortcutOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.HISTORY &&
                    <HistoryOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.SERVER &&
                    <ServerOptions/>
                }
                {
                    currentCategory === SETTING_CATEGORY.DATA &&
                    <DataOptions/>
                }
                </div>
            </div>
        </Modal>
    )
}

export default SettingModal;