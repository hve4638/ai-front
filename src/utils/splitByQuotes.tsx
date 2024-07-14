const pattern_say = /^(["][^"]*["])(.*)/
const pattern_think = /^([*][^*]*[*])(.*)/
const pattern_plain = /^([^"*]+)(["*].*)/
//const pattern_accent = /^(['][^']*['])(.*)/

export const splitByQuotes = (str:string) => {
    const parts:string[] = [];
    let text:string = str.trim();

    const tryMatchAndAddParts = (pattern) => {
        const group = pattern.exec(text);
        
        if (group) {
            parts.push(group[1]);
            text = group[2];
            return true;
        }
        else {
            return false;
        }
    }
    const AddRemainder = () => {
        parts.push(text);
        text = '';
        return true;
    }

    while (text.trim() !== '') {
        if (tryMatchAndAddParts(pattern_say)
        || tryMatchAndAddParts(pattern_think)
        || tryMatchAndAddParts(pattern_plain)
        || AddRemainder()
        ) continue;
    }

    return parts;
}