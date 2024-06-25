
export const parseResponse = (rawResponse:any) => {
    let tokens: number;
    let warning: string | null;
    try {
        tokens = rawResponse.usageMetadata.candidatesTokenCount;
    }
    catch (e) {
        tokens = 0;
    }
  
    const reason = rawResponse.candidates[0]?.finishReason;
    const text = rawResponse.candidates[0]?.content?.parts[0].text ?? '';
    if (reason == 'SAFETY') warning = 'blocked by SAFETY';
    else if (reason == "MAX_TOKENS") warning = 'token limit';
    else warning = null;
  
    return {
      output : text,
      tokens : tokens,
      finishreason : reason,
      normalresponse : true,
      warning : warning,
    }
  }