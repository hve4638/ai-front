export const requestGenimiAI = (contents, { then, onerror, apikey, maxToken=4000, temperature=0.7, topp=0.5, safety=false }) => {
    const text = contents;
    const body = {
      contents: [{
        parts: [{
          text: text
        }]
      }],
      "generation_config": {
        "maxOutputTokens": maxToken,
        "temperature": temperature,
        "topP": topp
      }
    };

    if (!safety) {
      body["safetySettings"] = [
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_NONE"
        }
      ];
    }

    console.log('<Request>');
    console.log(body);
    
    const controller = new AbortController();
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apikey}`, {
      signal : controller.signal,
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(async response => {
      const data = await response.json()
      if (!response.ok) {
        throw data.error.message;
      }
      else {
        return data;
      }
    })
    .then(data => then(data))
    .catch(error => onerror(error))
  
    return controller;
}

export function fetchAIRequest({ contents, then, onerror, apikey }) {
    const text = contents;
    console.log('<Request Text>');
    console.log(text);
    
    const controller = new AbortController();
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apikey}`, {
      signal : controller.signal,
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: text
          }]
        }],
        "generation_config": {
          "maxOutputTokens": 4000,
          "temperature": 0.7,
          "topP": 0.5
        },
        "safetySettings": [
          {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
          },
          {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
          },
          {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
          },
          {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
          }
      ]
      })
    })
    .then(async response => {
      const data = await response.json()
      if (!response.ok) {
        throw data.error.message;
      }
      else {
        return data;
      }
    })
    .then(data => then(data))
    .catch(error => onerror(error))
  
    return controller;
  }