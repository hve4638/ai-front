function throttle(interval) {
    let timeout = null;

    return (callback) => {  
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                callback();
            }, interval);
        }
    };
}

module.exports = {
    throttle : throttle
}