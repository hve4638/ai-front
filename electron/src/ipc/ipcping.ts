const PINGS = {
    ECHO : 'echo',
    OPEN_BROWSER : 'open-browser',
    OPEN_PROMPT_DIRECTORY : 'open-prompt-directory',
    
    FETCH : 'fetch-proxy',
    ABORT_FETCH : 'abort-fetch',
    GET_FETCH_RESPONSE : 'get-fetch-response',
    
    LOAD_ROOT_PROMPT_METADATA : 'load-root-prompt-metadata',
    LOAD_MODULE_PROMPT_METADATA : 'load-module-prompt-metadata',
    LOAD_PROMPT_TEMPLATE : 'load-prompt-template',

    GET_PROFILE_NAMES : 'get-profile-names',
    CREATE_PROFILE : 'create-profile',
    DELETE_PROFILE : 'delete-profile',
    
    LOAD_PROFILE_VALUE : 'load-profile-value',
    STORE_PROFILE_VALUE : 'store-profile-value',

    LOAD_PROFILE_HISTORY_COUNT : 'load-profile-history-count',
    LOAD_PROFILE_HISTORY : 'load-profile-history',
    STORE_PROFILE_HISTORY : 'store-profile-history',
    DELETE_PROFILE_HISTORY : 'delete-profile-history',
    DELETE_ALL_PROFILE_HISTORY : 'delete-all-profile-history',
    
    SET_LAST_PROFILE_NAME : 'set-last-profile-name',
    GET_LAST_PROFILE_NAME : 'get-last-profile-name',

    EXECUTE_PLUGIN : 'execute-plugin',

    WRITE_LOG : 'write-log',
} as const;

export default PINGS;