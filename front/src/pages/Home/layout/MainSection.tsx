// import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// import classNames from 'classnames';

// import useLazyThrottle from '@/hooks/useLazyThrottle';
// import useSignal from '@/hooks/useSignal';

// import InputField from '@/components/InputField';
// import { GoogleFontIcon } from '@/components/GoogleFontIcon';
// import { Grid } from '@/components/layout';

// import { useConfigStore, useSessionStore, useShortcutSignalStore, useSignalStore, useChannelStore } from '@/stores';

// import SplitSlider from './SplitSlider';

// import styles from '../styles.module.scss';

// function MainSection() {
//     const configState = useConfigStore();
//     const sessionState = useSessionStore();
//     const color = useSessionStore(state=>state.color);
//     const reloadInputSignal = useSignalStore(state=>state.reload_input);
    
//     let [left, right] = useConfigStore(state=>state.textarea_io_ratio);

//     const inputTextRef = useRef('');
//     const [_, refresh] = useSignal();
//     const textareaSectionRef = useRef(null);

//     const textAreaBorderRadius = `${configState.textarea_radius}px`;

//     const updateInputText = (text:string) => {
//         inputTextRef.current = text;
//         refresh();
//     }
    
//     // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
//     // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
//     const updateInputTextThrottle = useLazyThrottle(() => {
//         sessionState.update.input(inputTextRef.current);
//     }, 100);
    
//     useLayoutEffect(() => {
//         inputTextRef.current = sessionState.input;
//         refresh();
//     }, [sessionState.deps.last_session_id, reloadInputSignal]);

//     useEffect(()=>{
//         // signal 핸들링
//         const unsubscribes = [
//             useSignalStore.subscribe( // 요청 보내기 전 입력 업데이트
//                 (state)=>state.request,
//                 async ()=>{
//                     const { instance } = useChannelStore.getState();
                    
//                     await sessionState.update.input(inputTextRef.current);
//                     await instance.request_ready.produce(1);
//                 }
//             )
//         ];
//         return () => {
//             unsubscribes.forEach(unsub=>unsub());
//         }
//     }, []);
    
//     useEffect(()=>{
//         // hotkey signal 핸들링
//         const unsubscribes = [
//             useShortcutSignalStore.subscribe(
//                 state=>state.send_request,
//                 ()=>sessionState.actions.request(),
//             ),
//             useShortcutSignalStore.subscribe(
//                 state=>state.copy_response,
//                 ()=>{
//                     if (sessionState.output) {
//                         navigator.clipboard.writeText(sessionState.output);
//                     }
//                 },
//             ),
//         ];
//         return ()=>unsubscribes.forEach(unsubscribe=>unsubscribe());
//     }, []);


//     const gridWH = useMemo(()=>{
//         const sub = '1fr';
//         const main = `${left}fr ${right}fr`
        
//         if (configState.layout_mode == 'horizontal') {
//             return { rows : sub, columns : main }
//         }
//         else if (configState.layout_mode == 'vertical') {
//             return { rows : main, columns : sub }
//         }
//         else {
//             return { rows : sub, columns : main }
//         }
//     }, [configState.layout_mode, left, right]);

//     const textareaPadding = configState.textarea_padding;
//     const calcPadding = (side:'left'|'right'|'top'|'down') => {
//         const pad = configState.textarea_padding;
        
//         switch(side) {
//             case 'left':
//                 return [8, pad/2, pad, pad] as [number, number, number, number];
//             case 'right':
//                 return [8, pad, pad, pad/2] as [number, number, number, number];
//             case 'top':
//                 return [8, pad, pad/2, pad] as [number, number, number, number];
//             case 'down':
//                 return [pad/2, pad, pad, pad] as [number, number, number, number];
//         }
//     };

//     const layoutMode = configState.layout_mode;
//     const inputMargin = useMemo(()=>{
//         const m = (
//             layoutMode === 'horizontal'
//             ? calcPadding('left')
//             : calcPadding('top')
//         );
//         return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
//     }, [configState.layout_mode, textareaPadding]);
//     const outputMargin = useMemo(()=>{
//         const m = (
//             layoutMode === 'horizontal'
//             ? calcPadding('right')
//             : calcPadding('down')
//         );
//         return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
//     }, [configState.layout_mode, textareaPadding]);

//     return (
//         <>
//             <Grid
//                 ref={textareaSectionRef}
//                 className={
//                     classNames(
//                         styles['main-section'],
//                         'row',
//                         'flex',
//                         'body',
//                         'relative',
//                         `palette-${color}`
//                     )
//                 }
//                 style={{
//                     overflow : 'hidden',
//                     fontSize: `${configState.font_size}px`,
//                 }}
//                 rows={gridWH.rows}
//                 columns={gridWH.columns}
//             > 
//                 <InputField
//                     className='flex'
//                     style={{
//                         padding: '12px',
//                         zIndex: 0,
//                         margin: inputMargin,
//                         borderRadius: textAreaBorderRadius,
//                     }}
//                     text={inputTextRef.current}
//                     onChange={(text: string) => {
//                         updateInputText(text);
//                         updateInputTextThrottle();
//                         refresh();
//                     }}
//                 >
//                     <GoogleFontIcon
//                         className='floating-button'
//                         value='send'
//                         style={{
//                             cursor : 'pointer',
//                             fontSize: '40px',
//                             position: 'absolute',
//                             right: '10px',
//                             bottom: '10px',
//                         }}
//                         onClick={()=>{
//                             sessionState.actions.request();
//                         }}
//                     />
//                 </InputField>
//                 <InputField
//                     className='flex'
//                     style={{
//                         padding: '12px',
//                         zIndex: 0,
//                         margin: outputMargin,
//                         borderRadius: textAreaBorderRadius,
//                     }}
//                     text={sessionState.output ?? ''}
//                     onChange={()=>{}}
//                     tabIndex={-1}
//                 />

//                 <SplitSlider
//                     containerRef={textareaSectionRef}
//                 />
//             </Grid>
//         </>
//     )
// }

// export default MainSection;