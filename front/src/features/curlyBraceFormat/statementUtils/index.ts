import { CBFInternalErrors as InternalErrors } from './statements'
import { BranchError, UnexpectedEndError } from './errors'

export const CBFInternalErrors = {
    ...InternalErrors,
    Building : {
        BranchError,
        UnexpectedEndError
    }
}
export { PromptBuilder } from './promptBuilder'
export { Role } from './statements'
export type { ExpressionArgs, CurlyBraceFormatElement, ExpressionEventHooks } from './statements'