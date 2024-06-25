export function analytics() {
  const body = {
    id : 'ai-front',
    location : window.location.href, 
    referrer : document.referrer
  }

  const url = 'http://cthve.net/analytics';
  const controller = new AbortController();
  const promise = fetch(url, {
    signal : controller.signal,
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return promise;
}