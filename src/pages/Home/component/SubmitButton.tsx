import React from 'react';
import ArrowIcon from '../../../assets/icons/arrow.svg'
import LoadingIcon from '../../../assets/icons/loading.svg'
import { GoogleFontIconButton } from '../../../components/GoogleFontIcon.tsx';

interface SubmitButtonProps {
    submitIcon?:string;
    loadingIcon?:string;
    className?:string;
    loading:boolean;
    onSubmit:()=>void;
    onAbort:()=>void;
}

export function SubmitButton(props:SubmitButtonProps) {
    const {
        className='',
        submitIcon='chevron_right',
        loadingIcon='refresh',
        loading,
        onSubmit,
        onAbort
    } = props;
    return (
        <>
        {
            !loading &&
            <GoogleFontIconButton
                className={`font-button undraggable ${className}`}
                value={submitIcon}
                onClick={()=>onSubmit()}
            />
        }
        {
            loading &&
            <GoogleFontIconButton
                className={`rotate font-button undraggable ${className}`}
                value={loadingIcon}
                onClick={()=>onAbort()}
            />
        }
        </>
    );
}