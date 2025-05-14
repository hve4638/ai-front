import { useLayoutEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home';
import PromptEditor, {
    PromptEditAction,
    PromptEditMode
} from './PromptEditor';
import { RTStoreContextProvider } from '@/context';
import WorkflowEditor from './WorkflowEditor';

function Hub() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route
                    path="/prompt/:rtId"
                    element={
                        <RTStoreContextProvider>
                            <PromptEditor/>
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path="/workflow/:rtId/prompt/:promptId"
                    element={
                        <RTStoreContextProvider>
                            <PromptEditor/>
                        </RTStoreContextProvider>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default Hub;