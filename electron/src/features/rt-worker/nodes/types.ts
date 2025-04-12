import RTSender from '../RTSender';
import { GlobalRTFlowData } from '../types';

export type NodeData = {
    rtInput:RTInput;
    rtSender:RTSender;
    flowData:GlobalRTFlowData;
}