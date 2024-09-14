import { CBFParseError, CBFUnhandleError } from './errors';
import { 
    CBFInternalErrors
} from './statementUtils'

type WrapHintArgs = {
    line:number,
    column:number,
    text:string
}

export class CBFRawErrorWarper {
    splitPositionToLineColumn(position:number, text:string):number[] {
        try {
            let lines = text.trimEnd().split('\n');
            let line = 0;
            let column = 0;
            for (let i = 0; i < lines.length; i++) {
                if (position < lines[i].length) {
                    column = position;
                    break;
                }
                else if (i === lines.length - 1) {
                    column = lines[i].length - 1;
                    break;
                }
                else {
                    column = lines[i].length - 1;
                    position -= lines[i].length;
                    line++;
                }
            }
            return [ line, column ];
        }
        catch(e) {
            return [ 0, 0 ];
        }
    }

    warp(error:any, hint?:WrapHintArgs):CBFParseError {
        if (error instanceof CBFInternalErrors.Tokenization.TokenizeFailError) {
            const [ line, column ] = this.splitPositionToLineColumn(error.position, error.expressionText);

            return new CBFParseError(
                'Syntax Error : Invalid symbol',
                {
                    line: hint?.line ?? 1 + line,
                    column: hint?.column ?? 0 + column,
                    text: error.expressionText
                }
            );
        }
        else if (error instanceof CBFInternalErrors.Transformation.SyntaxTransformFailError
            || error instanceof CBFInternalErrors.Building.UnexpectedEndError
            || error instanceof CBFInternalErrors.Evaluation.IdentifierError
            || error instanceof CBFInternalErrors.Evaluation.NoHookError
            || error instanceof CBFInternalErrors.Evaluation.UnsupportedOperator
        ) {
            return new CBFParseError(
                'Syntax Error : ' + error.message,
                hint ?? {}
            );
        }
        else if (error instanceof CBFInternalErrors.Evaluation.HookEvaluationError) {
            return new CBFParseError(
                `Hook Error : ${error.message} (${error.name})\n${JSON.stringify(error.expression)}`,
                hint ?? {}
            );
        }
        else if (error instanceof CBFInternalErrors.Evaluation.InvalidExpressionError) {
            return new CBFParseError(
                'Logic Error : ' + error.message,
                hint ?? {}
            );
        }
        else {
            console.log("Unhandle Error", error);
            return new CBFUnhandleError(error);
        }
    }
}