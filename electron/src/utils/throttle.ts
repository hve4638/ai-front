
export function throttle(interval:number):(callback:()=>void)=>void {
    let timeout:NodeJS.Timeout|null = null;

    return (callback) => {  
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                callback();
            }, interval);
        }
    };
}

