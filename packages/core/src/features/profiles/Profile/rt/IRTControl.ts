import ProfileRT from "./ProfileRT";

interface IRTControl {
    /**
     * RT 트리 갱신
     * 
     * 새로운 RT 트리는 기존 트리에 존재하는 모든 RT를 포함해야 한다.
     *  
     * 새 RT 추가 후 위치 지정은, addRT()를 통한 RT 추가후 updateTree()를 호출해야 한다.
     * 
     * 새 디렉토리는 updateTree를 통해 바로 추가 및 제거할 수 있으며 빈 디렉토리도 허용된다.
     */
    updateTree(newTree:RTMetadataTree):Promise<void>;

    /**
     * 트리 반환
     */
    getTree():Promise<RTMetadataTree>;
    
    /**
     * 새 RT 추가 및 RTTree 반영
     * @param metadata 
     */
    addRT(metadata:RTMetadata, template?:RTTemplate):Promise<void>;
    
    /**
     * RT 제거 및 RTTree 반영
     * @param metadata 
     */
    removeRT(rtId:string):Promise<void>;

    /**
     * RT ID 변경
     * @param oldRTId 
     * @param newRTId 
     */
    changeId(oldRTId:string, newRTId:string):Promise<void>;
    hasId(rtId:string):Promise<boolean>;

    /**
     * 사용되지 않는 RTID 생성
     */
    generateId():Promise<string>;
    
    /**
     * RT 상태를 메타데이터에 반영
     */
    updateRTMetadata(rtId:string):Promise<void>;
    
    rt(rtId:string):ProfileRT;
}

export default IRTControl;