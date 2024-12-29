import toast from './toast'

const searchParam = (key, location = window.location.hash.split('?')[0]) => {
    return new URLSearchParams(location.search).get(key)
}
const delay = (time = 0) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, time)
    })
}

// 线性动画：以浏览器线性最优速率调用目标函数
function animate(callback, duration = 2000) {
    let start;
    function step(timestamp) {
        if (start === undefined)
            start = timestamp;
        const elapsed = timestamp - start;
        // callback 返回true继续 返回false停止
        const keepon = callback ? (callback(elapsed.toFixed(0)) ?? true) : false
        if (keepon && (elapsed < duration)) { // 在两秒后停止动画 
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

export {
    searchParam,
    delay,
    animate,
    toast,
}