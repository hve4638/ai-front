
function ConfigModal({
    promptText,
    note,
    onClose
 }) {
    return (
        <div className='modal-background center'>
            <div className='modal config-modal column'>
                <div className='row undraggable'>
                    <h2>환경</h2>
                    <div className='flex'/>
                    <span
                        className="material-symbols-outlined clickable modal-close-button"
                        onClick={(e)=>onClose()}
                    >
                        close
                    </span>
                </div>
                <div className='column scrollbar' style={{ overflow:'auto'}}>
                    <p className='noflex config-name undraggable'>Prompt</p>
                    <div className='noflex textplace column scrollbar' stlye={{position:'relative'}}>
                        {
                            promptText.split('\n').map((value, index) => (
                                <pre key={index} className='fontstyle'>
                                    {value == '' ? ' ' : value}
                                </pre>
                            ))
                        }
                    </div>
                    <p className='noflex config-name undraggable'>Note</p>
                    <div className='noflex textplace'>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

  
export default ConfigModal;