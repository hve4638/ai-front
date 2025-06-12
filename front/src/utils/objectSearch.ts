export const findValueByKey = (searchValue: any, items: object[], compareKey: any, returnKey: any): any => {
    for (const item of items) {
        if (searchValue == item[compareKey]) {
            return item[returnKey];
        }
    }
}
