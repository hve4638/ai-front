import Dropdown from '@/components/Dropdown';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { Align, Flex, Row } from '@/components/layout';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import { use } from 'i18next';

type APIItemProps = {
    item : APIKeyMetadata;
    onDelete : ()=>void;
    onChangeType : (type:'primary'|'secondary')=>void;
}

function APIItem({ item, onDelete, onChangeType }:APIItemProps) {
    const modal = useModal();

    return (
        <Row
            className='undraggable'
            style={{
                padding : '0 0.5em',
                gap : '0.5em',
            }}
            columnAlign={Align.Center}
        >
            <small>{item.display_name}</small>
            <Flex/>
            {/* <Dropdown
                style={{
                    fontSize: '0.8em',
                }}
                items={[{name:'주', key:'primary'}, {name:'보조', key:'secondary'}]}
                value={item.type}
                onChange={(value)=>{
                    onChangeType(value.key as 'primary'|'secondary');
                }}
                onItemNotFound={()=>{
                    onChangeType('primary');
                }}
            /> */}
            <GIconButton
                className='undraggable clickable'
                style={{
                    height: '100%',
                    cursor: 'pointer',
                }}
                value='delete'
                hoverEffect='square'
                
                onClick={()=>{
                    modal.open(DeleteConfirmDialog, {
                        onDelete: async () => {
                            onDelete();
                            return true;
                        }
                    })
                    
                }}
            />
        </Row>
    );
}

export default APIItem;