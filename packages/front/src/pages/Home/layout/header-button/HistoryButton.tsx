import { GIconButton } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import HistoryModal from '@/modals/HistoryModal';

function HistoryButton() {
    const modal = useModal();

    return (
        <GIconButton
            value='history'
            hoverEffect='circle'
            style={{
                height: '100%',
                aspectRatio: '1/1',
                fontSize: '2em',
                cursor: 'pointer',
            }}
            onClick={() => {
                modal.open(HistoryModal, {})
            }}
        />
    );
}

export default HistoryButton;