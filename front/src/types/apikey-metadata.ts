export type APIKeyMetadata = {
    type : 'primary'|'secondary';
    secret_id : string;
    display_name : string;
    activate : boolean;
    last_access : number;
}