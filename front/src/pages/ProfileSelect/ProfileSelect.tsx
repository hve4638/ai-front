import { useEffect, useState } from 'react';

import ProfilesAPI from '@/api/profiles';
import { ProfileAddButton, ProfileButton, ProfileOptionButton } from '@/pages/ProfileSelect/ProfileButton';

import RedIcon from '@/assets/img/red.png'
import useSignal from '@/hooks/useSignal';
import useMemoryStore from '@/stores/useMemoryStore';

import NewProfileModal from './NewProfileModal';
import { ProfileMetadata } from './types';
import { GIconButton } from '@/components/GoogleFontIcon';
import styles from './styles.module.scss';
import { useModal } from '@/hooks/useModal';
import GlobalSettingModal from './GlobalSettingModal';
import DivButton from '@/components/DivButton';
import classNames from 'classnames';
import RecoverProfileModal from './RecoverProfileModal';
import { InfoDialog } from '@/modals/Dialog';

function ProfileSelectPage() {
    const modal = useModal();
    const [reloadProfilesSignal, reloadProfiles] = useSignal();
    const [reloadOrphanProfilesSignal, reloadOrphanProfiles] = useSignal();
    const [editMode, setEditMode] = useState(false);
    const [profiles, setProfiles] = useState<ProfileMetadata[]>([]);
    const [profileIds, setProfileIds] = useState<string[]>([]);
    const [orphenProfileIds, setOrphenProfileIds] = useState<string[]>([]);

    const onSelect = (profileId: string) => {
        useMemoryStore.setState({ profileId });
    }

    useEffect(() => {
        ProfilesAPI.getIds()
            .then(async (nextProfileIds) => {
                const newProfiles: ProfileMetadata[] = [];
                for (const id of nextProfileIds) {
                    const profileAPI = ProfilesAPI.profile(id);
                    const { name, color } = await profileAPI.get('config.json', ['name', 'color']);
                    newProfiles.push({
                        id: id,
                        name: name,
                        color: color,
                    });
                }
                setProfileIds(nextProfileIds);
                setProfiles(newProfiles);
            });
    }, [reloadProfilesSignal]);

    useEffect(() => {
        ProfilesAPI.getOrphanIds()
            .then(async (ids) => {
                setOrphenProfileIds(ids);
            });
    }, [reloadOrphanProfilesSignal]);

    return (
        <div
            className='column center wfill undraggable relative'
            style={{
                padding: '8px',
            }}
        >
            <h2 className='center' style={{ marginBottom: '16px' }}>프로필 선택</h2>
            {
                profiles.map((metadata, index) => {
                    return (
                        <ProfileButton
                            key={index}
                            identifier={metadata.id}
                            name={metadata.name}
                            image={RedIcon}
                            onClick={async () => {
                                onSelect(metadata.id);
                            }}
                            onDelete={async (id) => {
                                await ProfilesAPI.delete(id)
                                    .then(() => {
                                        reloadProfiles();
                                    })
                                    .catch((error) => {
                                        console.error('Failed to delete profile:', error);
                                    });
                            }}
                            onRename={async (name) => {
                                const profile = ProfilesAPI.profile(metadata.id);
                                await profile.set('config.json', { name });
                                reloadProfiles();
                            }}
                            editMode={editMode}
                        />
                    );
                })
            }
            <ProfileAddButton
                onClick={() => {
                    modal.open(NewProfileModal, {
                        onSubmit: async (metadata) => {
                            const id = await ProfilesAPI.create();
                            const profile = ProfilesAPI.profile(id);
                            await profile.set('config.json', {
                                name: metadata.name,
                                color: metadata.color,
                            });

                            reloadProfiles();
                        }
                    })
                }}
            />
            <ProfileOptionButton onClick={() => setEditMode(prev => !prev)} />
            <GIconButton
                className={styles['profile-setting']}
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                }}
                value='settings'
                onClick={() => {
                    modal.open(GlobalSettingModal, {})
                }}
            />
            <DivButton
                className={
                    classNames(
                        styles['recovery-profile-button'],
                        {
                            [styles['highlight']]: orphenProfileIds.length !== 0,
                        }
                    )
                }
                style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                }}
                onClick={() => {
                    modal.open(RecoverProfileModal, {
                        orphanIds: orphenProfileIds,
                        onRecovery: async () => {
                            const promises = orphenProfileIds
                                .map(async (id) => await ProfilesAPI.recoverOrphan(id));

                            const result = await Promise.all(promises);
                            if (result.every((res) => res)) {
                                modal.open(InfoDialog, {
                                    title: '프로필 복구',
                                    children: '프로필을 복구했습니다',
                                })
                            }
                            else if (result.some((res) => res)) {
                                const successCount = result.filter((res) => res).length;
                                const failCount = result.filter((res) => !res).length;
                                modal.open(InfoDialog, {
                                    title: '프로필 복구',
                                    children: `일부 프로필을 복구했습니다 (${failCount}개 실패)`,
                                })
                            }
                            else {
                                modal.open(InfoDialog, {
                                    title: '프로필 복구',
                                    children: '프로필 복구에 실패했습니다',
                                });
                            }
                            reloadProfiles();
                            reloadOrphanProfiles();
                        }
                    });
                }}
            >프로필 복구</DivButton>
        </div>
    );
}

export default ProfileSelectPage;