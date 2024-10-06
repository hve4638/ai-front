import { TARGET_ENV } from "data/constants";

function analytics() {
    const body = {
        id: 'ai-front',
        env: TARGET_ENV,
        location: '',
        referrer: '',
    }
    if (TARGET_ENV === 'WEB') {
        body.location = window.location.href;
        body.referrer = document.referrer;
    }

    const url = 'http://analytics.cthve.net/ai-front';
    const controller = new AbortController();
    const promise = fetch(url, {
        signal: controller.signal,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return promise;
}

export default analytics;