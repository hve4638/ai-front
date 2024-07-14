import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

interface DropdownProps {
  value:any,
  items:any[],
  onChange:(x:any)=>void,
  style?:Object,
  className?:string,
  itemClassName?:string,
  titleMapper?:(value:any, items:any)=>string
}

const Dropdown = ({
  className='',
  itemClassName='',
  style={},
  value,
  items,
  onChange,
  titleMapper = (value, items)=>value
}:DropdownProps) => {
  const dropdownRef:any = useRef(null);
  //const [rect, setRect] = useState({bottom:0,height:0,left:0,right:0,top:0,width:0,x:0,y:0});
  const [isOpen, setIsOpen] = useState(false);
  const onGlobalClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }
  
  let rect;
  if (dropdownRef.current) {
    rect = dropdownRef.current.getBoundingClientRect();
  }


  // 전역마우스 클릭을 체크
  // Dropdown의 외부를 클릭했다면 펼쳐진 Dropdown을 다시 접는 역할
  useEffect(()=>{ 
    document.addEventListener('click', onGlobalClick);
    return () => {
      document.removeEventListener('click', onGlobalClick);
    };
  },[]);
  
  let selected = titleMapper(value, items);

  return (
    <div className={`${className} dropdown`} style={style} ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected}</span>
        <span className='dropdown-arrow material-symbols-outlined'>arrow_drop_down</span>
      </div>
      {
        isOpen && ReactDOM.createPortal(
          <ul
            className={`${itemClassName} dropdown-list`}
            style={{
              top: rect.bottom,
              left: rect.left,
              width: rect.width,
            }}
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
        ,document.getElementById('app') ?? document.body)
      }
    </div>
  );
};

const isEqualObj = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export default Dropdown;