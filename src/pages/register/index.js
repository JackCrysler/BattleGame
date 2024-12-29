/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { post } from '../../utils/fetch'
import toast from '../../utils/toast'
import './style.scss'
export default function Login(props) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const registerHandler = async () => {
        if (account && password) {
            const { code, msg } = await post('/register', {
                username: account,
                password
            })

            if (code === 1) {
                await toast.show('注册成功')
                await props.history.push('/login')
            } else {
                await toast.show(msg || '注册失败！')
            }
        } else {
            await toast.show('请正确填写信息！')
        }
    }

    return (
        <div className="page login flex-column flex-center">
            <p>欢迎体验</p>
            <div className="flex-column">
                <form>
                    <div className="form-item"><span>账号：</span><input name="account" placeholder="以1开头的11位数字" value={account} onChange={e => setAccount(e.target.value)} type="tel"/></div>
                    <div className="form-item"><span>密码：</span><input name="password" placeholder="6位长度/哈希加密" value={password} onChange={e => setPassword(e.target.value)} type="password"/></div>
                </form>
            </div>
            <div className="flex-center">
                <a role="button" aria-disabled="false" className={"button"} onClick={registerHandler}>注册</a>
            </div>
        </div>
    )
}
