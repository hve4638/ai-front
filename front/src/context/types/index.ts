import React from 'react';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

/**
 * ts에서 setState 초기값으로 지정하여 undefined로 추론되는걸 방지하기 위해 사용
 * 
 * 앱의 Intialize 단계에서 반드시 초기화되지만 ContextProvider에서 초기화되지 않는 경우에 사용한다
*/
export const ANY:any = undefined;