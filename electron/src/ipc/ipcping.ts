const PINGS = {
    ECHO : 'echo',
    OPEN_BROWSER : 'open-browser',
    GET_CHATAI_MODELS : 'get-chatai-models',
    
    /* 레거시 */
    FETCH : 'fetch-proxy',
    ABORT_FETCH : 'abort-fetch',
    GET_FETCH_RESPONSE : 'get-fetch-response',

    /* 마스터 키 */
    INIT_MASTER_KEY : 'init-master-key',
    IS_MASTER_KEY_EXISTS : 'is-master-key-exists',
    VALIDATE_MASTER_KEY : 'validate-master-key',
    GENERATE_MASTER_KEY : 'generate-master-key',
    RESET_MASTER_KEY : 'reset-master-key',
    RECOVER_MASTER_KEY : 'recover-master-key',

    /* 전역 스토리지 */
    GET_GLOBAL_DATA : 'get-global-data',
    SET_GLOBAL_DATA : 'set-global-data',

    /* 프로필 */
    CREATE_PROFILE : 'create-profile',
    DELETE_PROFILE : 'delete-profile',

    /* 프로필 목록 */
    GET_PROFILE_LIST : 'get-profile-list',
    GET_LAST_PROFILE : 'get-last-profile',
    SET_LAST_PROFILE : 'set-last-profile',
    
    /* 프로필 저장소 */
    GET_PROFILE_DATA : 'get-profile-data',
    SET_PROFILE_DATA : 'set-profile-data',
    GET_PROFILE_DATA_AS_TEXT : 'get-profile-data-as-text',
    SET_PROFILE_DATA_AS_TEXT : 'set-profile-data-as-text',
    GET_PROFILE_DATA_AS_BINARY : 'get-profile-data-as-binary',
    SET_PROFILE_DATA_AS_BINARY : 'set-profile-data-as-binary',
    
    /* 프로필 프롬프트 */
    GET_PROFILE_PROMPT_TREE : 'get-profile-prompt-tree',
    UPDATE_PROFILE_PROMPT_TREE : 'update-profile-prompt-tree',
    ADD_PROFILE_PROMPT : 'add-profile-prompt',
    REMOVE_PROFILE_PROMPT : 'remove-profile-prompt',

    /* 프로필 세션 */
    ADD_PROFILE_SESSION : 'add-profile-session',
    REMOVE_PROFILE_SESSION : 'remove-profile-session',
    GET_PROFILE_SESSION_IDS : 'get-profile-session-ids',
    REORDER_PROFILE_SESSIONS : 'reorder-profile-sessions',
    UNDO_REMOVE_PROFILE_SESSION : 'undo-remove-profile-session',

    /* 프로필 세션 저장소 */
    GET_PROFILE_SESSION_DATA : 'get-profile-session-data',
    SET_PROFILE_SESSION_DATA : 'set-profile-session-data',
    
    /* 프로필 세션 히스토리 */
    GET_PROFILE_SESSION_HISTORY : 'get-profile-session-history',
    ADD_PROFILE_SESSION_HISTORY : 'add-profile-session-history',
    DELETE_PROFILE_SESSION_HISTORY : 'delete-profile-session-history',
    DELETE_ALL_PROFILE_SESSION_HISTORY : 'delete-all-profile-session-history',

    /* 프로필 요청 템플릿 */
    GET_PROFILE_RT_TREE : 'get-profile-rt-tree',
    UPDATE_PROFILE_RT_TREE : 'update-profile-rt-tree',
    ADD_PROFILE_RT : 'add-profile-rt',
    REMOVE_PROFILE_RT : 'remove-profile-rt',
    GET_PROFILE_RT_MODE : 'get-profile-rt-mode',
    SET_PROFILE_RT_MODE : 'set-profile-rt-mode',
    GET_PROFILE_RT_PROMPT_TEXT : 'get-profile-rt-prompt-text',
    SET_PROFILE_RT_PROMPT_TEXT : 'set-profile-rt-prompt-text',
    HAS_PROFILE_RT_ID : 'has-profile-rt-id',
    GENERATE_PROFILE_RT_ID : 'generate-profile-rt-id',
    CHANGE_PROFILE_RT_ID : 'change-profile-rt-id',
} as const;

export default PINGS;