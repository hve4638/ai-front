import { GoogleFontIcon } from './GoogleFontIcon';
import ProfileAddIcon from 'assets/img/profile-add.svg';

type ProfileButtonProps = {
    name:string;
    identifier:string;
    image:any;
    onClick:(name:string, identifier:string)=>void;
}

export function ProfileButton({
    name, identifier, image, onClick
}:ProfileButtonProps) {
    return (
        <div
            className='row profile-button undraggable'
            style={{
                width : '180px',
                height : '48px',
                padding: '4px 4px',
                margin: '2px 0'
            }}
            onClick={(e)=>onClick(name, identifier)}
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
            <span
                className='center'
            >
                {name}
            </span>
        </div>
    );
}

export function ProfileAddButton() {
    return (
        <ProfileButton
            name='새 프로필'
            identifier='_'
            image={ProfileAddIcon}
            onClick={() => {
                console.log('새 프로필');
            }}
        />
    );
}

export function ProfileOptionButton() {
    return (
        <div
            className='row center'
            style={{
                padding: '4px 0'
            }}
        >
            <button
                onClick={() => {
                    console.log('설정');
                }}
            >
                설정
            </button>
        </div>
    );
}