/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { createSocket } from '../../socket'
import { get } from '../../utils/fetch'
import { Random } from 'mockjs'
import { searchParam, delay, toast } from '../../utils'
import history from '../../utils/history'
import './style.scss'

class Entry extends Component {
  uploadHiddleInput = null
  state = {
    showModal: false,
    playerInfo: {},
    opponentInfo: null,
    cancelReject: false
  }
  toBattle = () => {
    this.props.history.push('/battle')
  }
  startMatching = () => {
    const uid = searchParam('uid', this.props.history.location)
    const { playerInfo } = this.state
    const socket = createSocket()
    this.setState({ showModal: true })
    window.socket.open()

    const pkInfoStream = window.Rx.Observable.fromEvent(socket, 'pkinfo')
      .map(item => item).delay(1500)

    this.subscription = pkInfoStream.subscribe(async msg => {
      toast.show(`匹配到对手：${msg.nickname}`)

      this.setState({
        opponentInfo: msg,
        cancelReject: true
      })

      await delay(2000)

      this.props.history.push(`/battle?uid=${uid}&player=${playerInfo.nickname}&opponent=${msg.nickname}`)

    })
  }
  disConnect = () => {
    if (this.state.cancelReject) {
      return
    }
    window.socket.close()
    this.setState({ showModal: false })
  }
  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe()
  }
  async componentDidMount() {
    const uid = searchParam('uid', this.props.history.location)
    const data = await get('/pklist?uid=' + uid)
    if (!data.msg?.portrait_url) {
      data.msg.portrait_url = Random.image('125x125', '#02adea', '#fff', 'avatar')
    }
    this.setState({
      playerInfo: data.msg,
    }, () => {
      window.localStorage.setItem('pklist', JSON.stringify(data))
    })
  }
  render() {
    const { showModal, playerInfo, opponentInfo, cancelReject } = this.state

    return (
      <div className="page entry flex-column flex-center">
        <div className="start-anim flex-column">
          <div className="player-info">
            <p className="ellipse-text">昵称：<span>{playerInfo.nickname}</span></p>
            <p>账号：<span>{playerInfo.username}</span></p>
            <p className="player-avatar" onClick={() => {}}>
              {!playerInfo.portrait_url && <input className="player-avatar-input" type="file" ref={dom => this.uploadHiddleInput = dom} />}
              {!playerInfo.portrait_url && <span className="player-avatar-img flex-center">
                <svg width="20px" height="20px">
                  <line fill="#fff" stroke="#d68fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="4.666" y1="10" x2="15.334" y2="10" />
                  <line fill="#fff" stroke="#d68fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="10" y1="4.666" x2="10" y2="15.334" />
                </svg>
                <span className="upload-text">点击上传头像</span>
              </span>}
              {playerInfo.portrait_url && <img onClick={() => history.push('/record')} className="avatar-img" src={playerInfo.portrait_url} alt="avatar"/>}
            </p>
          </div>
        </div>
        <div className="start-area">
          <a role="button" aria-disabled="false" className="button start-button" onClick={this.startMatching}>开始匹配</a>
        </div>
        <div className="illustration">
          <p>游戏说明：</p>
          <p>1. 此游戏需要两人一起玩。</p>
          <p>2. 每次匹配共有5道题目。</p>
          <p>3. 每道题目有10秒答题时间，答题越快得分越高，答错不得分。</p>
          <p>4. 最后一题得分翻倍。</p>
        </div>
        <div className={`match-modal ${showModal ? "show" : "hide"}`}>
          <div className="modal-content">
            <div className="match-box">
              <div className="ellipse-text">{playerInfo.nickname}</div>
              <div>{opponentInfo?.nickname ? 'PK' : <p>匹配中<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></p>}</div>
              <div className="ellipse-text">{opponentInfo?.nickname}</div>
            </div>
            <div className="flex-center">
              <a role="button" aria-disabled="false" className={"button cancel-button " + (cancelReject ? 'disable-button' : '')} onClick={this.disConnect}>取消</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Entry
