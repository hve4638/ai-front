export const VERTEXAI_URL = 'https://{{location}}-aiplatform.googleapis.com/v1/projects/{{projectid}}/locations/{{location}}/publishers/anthropic/models/{{model}}:rawPredict'

export const ROLE_DEFAULT = "USER";
export const ROLE = {
  "user" : "user",
  "system" : "system",
  "model" : "assistant",
  "assistant" : "assistant",
  "bot" : "assistant"
}