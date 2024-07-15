import React, { useEffect, useState } from "react";
import { InputFull } from "../Forms.tsx";

export function GeminiOptions({option, setOption}) {
    const [apikey, setAPIKey] = useState("");

    return (
        <>
            <InputFull
                name='Google Gemini API Key'
                value={apikey}
                onChange={(value:string)=>{
                    setAPIKey(value);

                    const newOptions = {...option};
                    newOptions.apikey = value;
                    setOption(newOptions);
                }}
                placeholder={(option.apikey?.length ?? 0) > 0 ? 'no change' : 'empty'}
            />
        </>
    )
}