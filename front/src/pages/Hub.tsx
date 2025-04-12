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
                <Route path="/prompts">
                    <Route
                        path=":rtId/edit"
                        element={
                            <RTStoreContextProvider>
                                <PromptEditor
                                    mode={PromptEditMode.PromptOnly}
                                    action={PromptEditAction.EDIT}
                                />
                            </RTStoreContextProvider>
                        }
                    />
                    {/* <Route path=":id/show" element={<PromptEditor/>}/> */}
                </Route>
                <Route path="/workflow">
                    <Route
                        path=":rtId"
                        element={
                            <RTStoreContextProvider>
                                <WorkflowEditor/>
                            </RTStoreContextProvider>
                        }
                    />
                    {/* <Route path="/:id" element={<PromptEditor/>}/> */}
                </Route>
                {/* <Route path="/edit/flow/*" element={<PromptEditor/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Hub;