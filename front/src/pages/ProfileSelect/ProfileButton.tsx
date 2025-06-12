import classNames from 'classnames';
import ProfileAddIcon from '@/assets/img/profile-add.svg';

import { Flex } from '@/components/layout';
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '@/modals/Dialog';

import styles from './styles.module.scss';
import EditProfileModal from './EditProfileModal';

type ProfileButtonProps = {
    name:string;
    identifier:string;
    image:any;
    onClick:(name:string, identifier:string)=>void;
    onRename?:(name:string)=>Promise<void>;
    onDelete?:(id:string)=>Promise<void>;

    editMode?:boolean;
}

export function ProfileButton({
    name,
    identifier,
    image,
    onClick,
    onRename = async () => {},
    onDelete = async () => {},

    editMode = false,
}:ProfileButtonProps) {
    const modal = useModal();

    return (
        <div
            className={
                classNames(
                    'row undraggable',
                    styles['profile-button'],
                )
            }
            style={{
                width : '200px',
                height : '48px',
                padding: '4px 4px',
                margin: '2px 0',
                cursor: 'pointer',
            }}
            onClick={(e)=>onClick(name, identifier)}
            tabIndex={0}
            onKeyDown={(e)=>{
                if (e.key === 'Enter') {
                    onClick(name, identifier);
                }
            }}
        >
            <div
                className='center'
                style={{
                    width: '48px',
                    marginRight : '6px',
                }}
            >
                <img
                    style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '15px'
                    }}
                    src={image}
                />
            </div>
            <span className={classNames(styles['profile-name'])}>{name}</span>
            <Flex/>
            {
                editMode &&
                <GIconButton
                    value='edit'
                    style={{
                        margin: 'auto',
                        width: '1.5em',
                        height: '1.5em',
                        aspectRatio: '1',
                    }}
                    hoverEffect='square'
                    onClick={(e)=>{
                        modal.open(EditProfileModal, {
                            name: name,
                            onDelete: async () => {
                                await onDelete(identifier);
                            },
                            onRename: async (name) => {
                                await onRename(name);
                            }
                        });

                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            }
        </div>
    );
}

export function ProfileAddButton({
    onClick
}:{
    onClick:()=>void
}) {
    return (
        <ProfileButton
            name='새 프로필'
            identifier='_'
            image={ProfileAddIcon}
            onClick={onClick}
        />
    );
}

interface ProfileOptionButtonProps {
    onClick?: () => void;
}

export function ProfileOptionButton({ onClick }: ProfileOptionButtonProps) {
    return (
        <small
            className='row center'
            style={{
                padding: '4px 0',
            }}
            onClick={onClick}
        >
            <span
                className='clickable-text row'
            >
                <GoogleFontIcon
                    value='edit'
                    style={{
                        paddingRight: '4px'
                    }}
                />
                <em>편집</em>
            </span>
        </small>
    );
}