import React, { useEffect, useState } from 'react';
import { FileUploadForm, InputFull } from '../Forms';

export function GoogleVertexAIOptions({option, setOption}) {
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');

    return (
        <>
            <FileUploadForm
                name='VertexAI Key (json)'
                onUpload={(files)=>{
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data:any = e.target?.result;
                        try {
                            const obj = JSON.parse(data);
                            const projectid = obj.project_id;
                            const privatekey = obj.private_key;
                            const clientemail = obj.client_email;

                            if (!projectid || !privatekey || !clientemail) {
                                throw new Error('Invalid File');
                            }
                            
                            setMessage('파일을 불러왔습니다.')
                            setMessageColor('green')
                            const newOption = {
                                ...option,
                                projectid,
                                privatekey,
                                clientemail
                            };
                            setOption(newOption);
                        }
                        catch(e) {
                            setMessage('잘못된 파일입니다.')
                            setMessageColor('red')
                        }
                    }
                    reader.readAsText(files[0]);
                }}
            />
            <span style={{fontSize:'0.8em', color: messageColor}}>{message}</span>
        </>
    )
}