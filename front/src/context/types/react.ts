import React from 'react';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
export type SetStateAsync<T> = (value: T|((prev:T)=>T)) => Promise<void>
