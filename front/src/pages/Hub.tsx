import { useLayoutEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';
import PromptEditor, {
    PromptEditAction,
    PromptEditMode
} from './PromptEditor';
import { ProfileRTContextProvider } from 'context/ProfileRTContext';

function Hub() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/prompts">
                    <Route
                        path="new"
                        element={
                            <ProfileRTContextProvider>
                                <PromptEditor
                                    mode={PromptEditMode.PromptOnly}
                                    action={PromptEditAction.NEW}
                                />
                            </ProfileRTContextProvider>
                        }
                    />
                    <Route
                        path=":rtId/edit"
                        element={
                            <ProfileRTContextProvider>
                                <PromptEditor
                                    mode={PromptEditMode.PromptOnly}
                                    action={PromptEditAction.EDIT}
                                />
                            </ProfileRTContextProvider>
                        }
                    />
                    {/* <Route path=":id/show" element={<PromptEditor/>}/> */}
                </Route>
                <Route path="/flow">
                    {/* <Route path="/:id" element={<PromptEditor/>}/> */}
                </Route>
                {/* <Route path="/edit/flow/*" element={<PromptEditor/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Hub;