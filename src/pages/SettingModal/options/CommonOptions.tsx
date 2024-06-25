import React from "react";
import { ButtonFull, InputSmall } from "../Forms.tsx";
import { getCookies, removeCookie } from "../../../libs/cookies.tsx";

export function CommonOptions({ value }) {
    const {
        maxtoken, setMaxtoken,
        temperature, setTemperature,
        topp, setTopp
    } = value;
    return (
        <>
            <InputSmall
                name = "응답 토큰 제한"
                value = {maxtoken}
                onChange={setMaxtoken}
            />
            <InputSmall
                name = "온도"
                value = {temperature}
                onChange={setTemperature}
            />
            <InputSmall
                name = "top-p"
                value = {topp}
                onChange={setTopp}
            />
            <div style={{ height: '10px' }}/>
            <ButtonFull
                name="데이터 초기화"
                onClick={()=>{
                    for (const name of getCookies()) {
                        removeCookie(name);
                    }
                    window.location.reload();
                }}
            />
        </>
    )
}