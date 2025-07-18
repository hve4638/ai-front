import React from 'react';
import { Handle, Position } from '@xyflow/react';

function InputNode({ data, isConnectable }) {
    return (
        <div>
            <span>{data.label}</span>
            {/* <Handle type="source" position={Position.Right} id="output" /> */}
            <Handle type="source" position={Position.Right} style={{ top: '33%' }} id={'input_0'} isConnectable={isConnectable}/>
            <Handle type="source" position={Position.Right} style={{ top: '66%' }} id={'input_1'} isConnectable={isConnectable}/>
        </div>
    );
}

export default InputNode;
// <Handle type="target" position={Position.Left} id="input" />