import { CheckBoxForm, DropdownForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { ProfileEventContext, useContextForce } from 'context';

function HistoryOptions() {
    const profileContext = useContextForce(ProfileEventContext);
    const {
        configs,
    } = profileContext;

    return (
        <>
            <CheckBoxForm
                name='기록 활성화'
                checked={configs.historyEnabled}
                onChange={configs.setHistoryEnabled}
            />
            <NumberForm
                name='세션 당 최대 저장 기록 수'
                width='6em'
                value={configs.maxHistoryLimitPerSession}
                onChange={configs.setMaxHistoryLimitPerSession}
            />
            <DropdownForm
                name='최대 저장 일수'
                items={
                    [
                        { name: '무제한', key: '0' },
                        { name: '1일', key: '1' },
                        { name: '1주', key: '7' },
                        { name: '1개월', key: '30' },
                        { name: '3개월', key: '90' },
                        { name: '6개월', key: '180' },
                        { name: '1년', key: '365' },
                    ]
                }
                value={String(configs.maxHistoryStorageDays)}
                onChange={(item)=>{
                    configs.setMaxHistoryStorageDays(Number(item.key));
                }}
            />
        </>
    )
}

export default HistoryOptions;