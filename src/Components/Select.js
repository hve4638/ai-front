function Select({name, children, onChange, style}) {
    return (
      <div className='noflex select-container undraggable' style={style}>
        <select
          name={name} className='select-box'
          onChange={(e)=>onChange(e.target.value)}
        > 
          {children}
        </select>
        <div className='icon-container'>
          <span className='material-symbols-outlined'>
            arrow_drop_down
          </span>
        </div>
    </div>
    );
}

export default Select;