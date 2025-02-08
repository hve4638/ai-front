import { useLayoutEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';
import PromptEditor from './PromptEditor';

function Hub() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/prompts">
                    <Route path="new" element={<PromptEditor mode='NEW'/>}/>
                    <Route path=":id/edit" element={<PromptEditor mode='NEW'/>}/>
                    {/* <Route path=":id/show" element={<PromptEditor/>}/> */}
                </Route>
                <Route path="/flow">
                </Route>
                {/* <Route path="/edit/flow/*" element={<PromptEditor/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Hub;