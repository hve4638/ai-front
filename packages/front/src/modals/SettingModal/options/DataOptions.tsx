import { useState } from 'react';
import ButtonForm from 'components/Forms/ButtonForm';

function DataOptions() {
    return (
        <>
            <b>백업</b>
            <hr/>
            <ButtonForm
                name='데이터 백업'
                text='백업'
                onClick={()=>{
                    
                }}
            />
            <ButtonForm
                name='데이터 가져오기'
                text='가져오기'
                onClick={()=>{
                    
                }}
            />
            <div style={{height:'2em'}}/>
            <b>초기화</b>
            <hr/>
            <ButtonForm
                name='데이터 초기화'
                text='데이터 초기화'
                onClick={()=>{
                    console.log('데이터 초기화');
                }}
            />
        </>
    )
}

export default DataOptions;