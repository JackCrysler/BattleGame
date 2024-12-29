import React from 'react'
import ReactDOM from 'react-dom'
import Toast from '../components/toast'

function show(msg = '提示', time = 1500) {
    let modalDom = document.querySelector('.__modal__');
    if (!modalDom) {
        modalDom = document.createElement('div')
        modalDom.classList.add('__modal__')
        document.body.appendChild(modalDom)
    }
    ReactDOM.render(<Toast msg={msg.toString()} />, modalDom)

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
            ReactDOM.render(null, modalDom)
        }, time)
    })

}
function hide() {
    let modalDom = document.querySelector('.__modal__');
    ReactDOM.render(null, modalDom)
}

const toast = {
    show,
    hide
}

export default toast
