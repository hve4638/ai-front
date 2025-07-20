import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useProfileAPIStore, useSessionStore, useSignalStore } from '@/stores';
import Dropdown, { DropdownItem, DropdownItemList } from '@/components/Dropdown';
import { GoogleFontIcon } from '@/components/GoogleFontIcon';

import { useModal } from '@/hooks/useModal';
import NewRTModal from '@/modals/NewRTModal';
import { mapRTMetadataTree } from '@/utils/rt';
import DivButton from '@/components/DivButton';
import ProfileEvent from '@/features/profile-event';

const CREATE_NEW_PROMPT = 'CREATE_NEW_PROMPT';

function RTDropdown() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modal = useModal();
    const rtId = useSessionStore(state=>state.rt_id);
    const name = useSessionStore(state=>state.name);
    const api = useProfileAPIStore(state=>state.api);
    const signal = useSignalStore(state=>state.signal);
    const updateSessionState = useSessionStore(state=>state.update);
    const refreshRtTreeSignal = useSignalStore(state => state.refresh_rt_tree);

    const [tree, setTree] = useState<RTMetadataTree>([]);
    const dropdownItems:(DropdownItem|DropdownItemList)[] = useMemo(()=>{
        return mapRTMetadataTree<DropdownItem, DropdownItemList>(tree, {
            mapDirectory : (item, children)=>{
                return {
                    name: item.name,
                    list: children,
                };
            },
            mapNode : (item)=>({
                name: item.name,
                key: item.id,
            }),
        });
    }, [tree]);

    const openNewRTModal = ()=>{
        modal.open(NewRTModal, {
            onAddRT: (rtId:string, mode:RTMode) => {
                navigate(`/workflow/${rtId}/prompt/default`);
            }
        });
    }

    const changeRT = async (rtId:string)=>{
        await updateSessionState.rt_id(rtId);
        
        if (name == null || name === '') {
            await signal.session_metadata();
        }
    }

    useEffect(()=>{
        ProfileEvent.rt.getTree()
            .then((tree)=>{
                setTree(tree);
            });
    }, [refreshRtTreeSignal]);
    
    return (
        dropdownItems.length === 0
        ? <>
            <DivButton
                onClick={openNewRTModal}
            >
                <GoogleFontIcon value='add' style={{marginRight:'4px'}}/>
                <span>새 요청 템플릿</span>
            </DivButton>
        </>
        : <Dropdown
            style={{
                minWidth: '48px',
            }}
            items={[
                ...dropdownItems,
                {
                    name: t('rt.new_rt'),
                    key : CREATE_NEW_PROMPT,
                }
            ]}
            value={rtId}
            renderItem={renderRTDropdownItem}
            onChange={(item)=>{
                if (item.key === CREATE_NEW_PROMPT) {
                    openNewRTModal();
                }
                else {

                    changeRT(item.key);
                }
            }}
            onItemNotFound={()=>{
                if (dropdownItems.length === 0) return;
                else if ('key' in dropdownItems[0]) {
                    changeRT(dropdownItems[0].key);
                }
                else if ('list' in dropdownItems[0]) {
                    changeRT(dropdownItems[0].list[0].key);
                }
            }}
        />
    );
}

function renderRTDropdownItem(item: DropdownItem|DropdownItemList, parentList?: DropdownItemList|undefined) {
    let prefixIcon = <></>
    if ('key' in item && item.key === CREATE_NEW_PROMPT) {
        prefixIcon = <GoogleFontIcon value='add' style={{marginRight:'4px'}}/>
    }
    
    return (<>
        {prefixIcon}
        <span>{item.name}</span>
    </>);
}

export default RTDropdown;