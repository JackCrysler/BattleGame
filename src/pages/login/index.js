/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { post } from './../../utils/fetch'
import toast from './../../utils/toast'
import Mock from 'mockjs'
import './style.scss'
export default function Login(props) {
  const [account, setAccount] = useState('')
  const [nickName, setNickname] = useState('')
  const [password, setPassword] = useState('')
  // const Rx = window.Rx
  const loginHandler = async () => {
    if (account && password) {
      if (nickName?.length > 30) {
        toast.show('昵称过长！')
        return
      }
      if (account?.length !== 11) {
        toast.show('请检查账号信息！')
        return
      }
      const { code, msg, data } = await post('/login', {
        username: account,
        nickname: nickName || account,
        password
      })

      if (code === 1) {
        localStorage.setItem('pkgame-login-data', JSON.stringify({
          username: account,
          nickname: nickName,
        }))
        await toast.show('登陆成功')
        await props.history.push('/entry?uid=' + data.uid)
      } else {
        toast.show(msg || '登陆信息有误！')
      }
    } else {
      toast.show('账户和密码不可为空！')
    }
  }

  const setMockName = () => {
    const mockName = Mock.Random.name()
    setNickname(mockName)
  }

  useEffect(() => {
    const loginData = localStorage.getItem('pkgame-login-data');
    if (loginData) {
      try {
        const { username, nickname } = JSON.parse(loginData)
        setAccount(username)
        setNickname(nickname)
      } catch (err) {
        toast.show(err)
      }
    } else {
      setMockName()
    }
  }, [])
  return (
    <div className="page login flex-column flex-center">
      <p className="page-title">仿头脑王者实时PK答题</p>
      <div className="flex-column">
        <form>
          <div className="form-item"><span>账号：</span><input name="account" value={account} onChange={e => setAccount(e.target.value)} type="tel" /></div>
          <div className="form-item"><span>昵称：</span><input name="nickname" value={nickName} onChange={e => setNickname(e.target.value)} type="text" /><span className="generate-random-name-button" onClick={setMockName}>更换</span></div>
          <div className="form-item"><span>密码：</span><input name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" /></div>
        </form>
      </div>
      <div className="flex-center flex-column">
        <a role="button" aria-disabled="false" className={"button"} onClick={loginHandler}>登陆</a>
        <a className="go-register" onClick={() => props.history.push('/register')}>没有账号？去注册</a>
        <a className="go-register" onClick={() => props.history.push('/learnmore')}>了解更多</a>
      </div>
    </div>
  )
}
