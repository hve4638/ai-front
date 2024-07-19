const RE_BRACKET = /^(.*?)\{\{([^\s{}]+?)\}\}(.*)$/ms

export function bracketFormat(text: string, notes: Object | Map<string, string>): string {
    const splited: string[] = [];

    while (text.length != 0) {
        const group = text.match(RE_BRACKET);
        if (group == null) {
            splited.push(text);
            text = "";
        }
        else {
            splited.push(group[1]);
            if (group[2] in notes) {
                splited.push(notes[group[2]]);
            }
            text = group[3];
        }
    }

    return splited.join('');
}