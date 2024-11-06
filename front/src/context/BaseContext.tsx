/**
 * BaseContext는 하위 Context에 필요한 Profile 정
*/
import React, { useState, createContext } from 'react';
import { SetState } from './types';
import { Profile } from 'features/profiles';

type ErrorLog = {
    name: string;
    identifier: string;
    message: string[];
}

interface BaseContextType {
    // 프로필 정보
    profileName:string|null;
    setProfileName:SetState<string|null>;

    errorLogs:ErrorLog[];
    setErrorLogs:SetState<ErrorLog[]>;
}

/**
 * 프로그램 실행 동안만 존재하는 휘발성 정보 저장 컨텍스트
 */
export const MemoryContext = createContext<BaseContextType|null>(null);

export default function BaseContextProvider({children}) {
    const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
    const [profileName, setProfileName] = useState<string|null>(null);
    
    return (
        <MemoryContext.Provider
            value={{
                profileName, setProfileName,
                errorLogs, setErrorLogs,
            }}
        >
            {children}
        </MemoryContext.Provider>
    )
}