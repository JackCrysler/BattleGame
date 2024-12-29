import React from 'react'
import './style.scss'

export default function Toast(props) {
    return (
        <div className="toast">
            <div className="toast-content">
                <p>{props.msg}</p>
            </div>
        </div>
    )
}
