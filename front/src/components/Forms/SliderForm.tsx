import { Align, Flex, Row } from '@/components/layout';
import { RCSlider, TooltipSlider } from '@/components/Slider';

interface SliderFormProps {
    className?:string;
    style?:React.CSSProperties;

    name:string;
    min:number;
    max:number;
    value:number;
    marks?:Record<number, string>;
    onChange:(value:number)=>void;
}

function SliderForm({
    className='',
    style={},

    name,
    min,
    max,
    value,
    onChange,
    marks={}
}:SliderFormProps) {
  return (
    <Row
        className={className}
        style={{
            width : '100%',
            height: '1.4em',
            margin: '0.5em 0',
            ...style,
        }}
        columnAlign={Align.Center}
    >
        <span className='noflex undraggable'>
            {name}
        </span>
        <div
            className='flex undraggable'
            style={{
                boxSizing: 'border-box',
                paddingLeft: '1em',
                paddingRight: '0.5em',
            }}
        >
            <RCSlider
                min={min}
                max={max}
                value={value}
                onChange={(v)=>onChange(v as number)}
                marks={marks}
            />
        </div>
    </Row>
  );
}

export default SliderForm;