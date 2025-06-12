function calcTextPosition(text:string, posiiton:number):{column:number, line:number} {
    const lines = text.split('\n');
    let line = 0;
    let column = 0;
    for (let i = 0; i < lines.length; i++) {
        console.log('calc: ', i, lines)
        if (posiiton < lines[i].length) {
            line = i;
            column = posiiton;
            break;
        }
        posiiton -= lines[i].length + 1;
    }
    return {line, column};
}

export default calcTextPosition;