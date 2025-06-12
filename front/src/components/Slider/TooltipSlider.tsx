import React from 'react';
import Slider, { SliderProps } from 'rc-slider';
import 'rc-slider/assets/index.css';

interface HandleTooltipProps {
    value: number;
    dragging: boolean;
    style?: React.CSSProperties;
}

const HandleTooltip = ({
    value,
    dragging,
    style,
    ...restProps
}: HandleTooltipProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div {...restProps}>
        {dragging && (
            <div
                style={{
                    position: 'absolute',
                    top: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '2px 6px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                }}
            >
                {value}
            </div>
        )}
    </div>
);

const TooltipSlider = (props: SliderProps) => (
    <Slider
        {...props}
        handleRender={(node, handleProps) => (
            <HandleTooltip
                {...handleProps}
            >
                {node}
            </HandleTooltip>
        )}
    />
);

export default TooltipSlider;
