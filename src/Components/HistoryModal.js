
function HistoryModal({
    history,
    onChangeHistory,
    onClick,
    onClose
 }) {
    return (
        <div className='modal-background center'>
            <div className='modal history-modal undraggable column'>
                <div className='row'>
                    <h2>기록</h2>
                    <div className='flex'/>
                    <span
                        className="material-symbols-outlined clickable modal-close-button"
                        onClick={(e)=>onClose()}
                    >
                        close
                    </span>
                </div>
                <div className='column-reverse scrollbar' style={{overflow:'auto'}}>
                    {
                        history.map((value, index) => (
                            <div
                                key={index}
                                className='history column'
                                onClick={(e)=>onClick(value)}
                            >
                                <p>{value.input}</p>
                                <p>{value.output}</p>
                            </div>
                        ))
                    }
                    <div className='noflex center info'>
                        기록은 사이트를 나가면 사라집니다
                    </div>
                </div>
            </div>
        </div>
    )
}

  
export default HistoryModal;