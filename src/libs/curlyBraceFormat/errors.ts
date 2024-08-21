export class ParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

export class CBFParseError extends Error {
    // line and column are 1-based
    line?:number;
    column?:number;
    text?:string

    constructor(message: string, { line, column, text }: { line?:number, column?:number, text?:string }) {
        super(message);
        this.name = 'CBFParseError';
        this.line = line;
        this.column = column;
        this.text = text;
    }
}

export class CBFUnhandleError extends Error {
    error;

    constructor(error:any) {
        super('Unexpected Error');
        this.name = 'CBFUnhandleError';
        this.error = error;
    }
}