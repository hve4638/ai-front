export type DropdownItem = Required<{
    name : string;
    key : string;
}>;
export type DropdownItemList = Required<{
    name : string;
    list : DropdownItem[];
}>;