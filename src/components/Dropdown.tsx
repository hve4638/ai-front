import React, { useEffect, useState, useRef } from "react";

interface DropdownProps {
  value:any,
  items:any[],
  onChange:(x:any)=>void,
  style?:Object,
  className?:string,
  titleMapper?:(value:any, items:any)=>string
}

/** Dropdown */
const Dropdown = ({
  className='',
  style={},
  value,
  items,
  onChange,
  titleMapper = (value, items)=>value
}:DropdownProps) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const onGlobalClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  // 전역마우스 클릭을 체크해 Dropdown의 외부를 클릭했다면 펼쳐진 Dropdown을 다시 접는 역할
  useEffect(()=>{ 
    document.addEventListener('click', onGlobalClick);
    return () => {
      document.removeEventListener('click', onGlobalClick);
    };
  },[])

  let selected = titleMapper(value, items);

  return (
    <div className={`${className} dropdown`} style={style} ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected}</span>
        <span className='dropdown-arrow material-symbols-outlined'>arrow_drop_down</span>
      </div>
      {
        isOpen && (
        <ul
          className="dropdown-list"
        >
        {
          items.map((item, index) => (
            <li
              key={item.name}
              className="dropdown-item center"
              onClick={(e) => {
                setIsOpen(false);
                onChange(item.value);
              }}>
              {item.name}
            </li>
          ))
        }
        </ul>
      )}
    </div>
  );
};

export default Dropdown;