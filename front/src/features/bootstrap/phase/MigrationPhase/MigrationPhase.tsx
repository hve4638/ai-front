import { useEffect } from 'react';
import useBootStore from '../../useBootStore';
import { BootResult } from '../type';

import LocalAPI from '@/api/local';

import { useModal } from '@/hooks/useModal';
import { ChoiceDialog } from '@/modals/Dialog';

function MigrationPhase() {
    const { update } = useBootStore();
    const modal = useModal();

    const finish = () => {
        update.nextPhase();
    }

    useEffect(() => {
        LocalAPI.general.existsLegacyData()
            .then((exists) => {
                console.log(exists);
                if (exists) {
                    modal.open(ChoiceDialog, {
                        title: '마이그레이션',
                        children: (
                            <div style={{ display: 'block' }}>
                                <div>이전 버전 데이터를 가져오겠습니까?</div>
                            </div>
                        ),
                        choices: [
                            { text: '마이그레이션', tone: 'default' },
                            { text: '취소', tone: 'dimmed' },
                        ],
                        onSelect: async (choice, index) => {
                            if (index === 0) {
                                await LocalAPI.general.migrateLegacyData();
                                finish();
                            }
                            else {
                                await LocalAPI.general.ignoreLegacyData();
                                finish();
                            }

                            return true;
                        },
                    });
                }
                else {
                    finish();
                }
            })
            .catch((error) => {
                finish();
            });

    }, []);


    return <></>;
}

export default MigrationPhase;