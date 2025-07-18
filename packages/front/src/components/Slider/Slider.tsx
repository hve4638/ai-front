import React from 'react';
import Slider, { SliderProps } from 'rc-slider';
import Tooltip from 'rc-tooltip';

const HandleTooltip = ({ value, dragging, children }: { value: number; dragging: boolean; children: React.ReactElement }) => (
    <Tooltip
        overlay={value}
        visible={dragging}
        placement="top"
    >
        {children}
    </Tooltip>
);

const TooltipSlider = (props: SliderProps) => {
    const handleRender: SliderProps['handleRender'] = (node, handleProps) => (
        <HandleTooltip value={handleProps.value} dragging={handleProps.dragging}>
            {node}
        </HandleTooltip>
    );

    return <Slider {...props} handleRender={handleRender} />;
};

export default TooltipSlider;
