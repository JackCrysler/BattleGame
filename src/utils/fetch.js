const baseUrl = process.env.NODE_ENV === "production" ? `/game` : ``

const post = (url, data) => {
    return window.fetch(baseUrl + url,
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
}
const get = (url) => {
    return window.fetch(baseUrl + url, {
        method: 'GET', // or 'PUT'
    }).then(res => res.json())
}

export { post, get }