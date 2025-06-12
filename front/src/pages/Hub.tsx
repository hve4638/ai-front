import { useLayoutEffect, useMemo, useState } from 'react'
import { BrowserRouter, HashRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home';
import PromptEditor, {
    PromptEditAction,
    PromptEditMode
} from './PromptEditor';
import { RTStoreContextProvider } from '@/context';
import WorkflowEditor from './WorkflowEditor';

function Hub() {
    return (
        <HashRouter>
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
        </HashRouter>
    )
}

export default Hub;