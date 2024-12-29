/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { searchParam } from '../../utils'
import history from '../../utils/history'
import './style.scss'

const DetailRow = ({left, right, separator='：'}) => {
  return <p className="detail-row ellipse-text"><span className="detail-row-left">{left}{separator}</span><span className="detail-row-right">{right}</span></p>
}
export default class Result extends Component {
  state = {
    winner: '',
    detail: []
  }
  replay = () => {
    const { history, location } = this.props

    history.push(`/entry?uid=${searchParam('uid', location)}`)
  }
  keepSocket = () => {
    let socket = window.socket
    if (!socket) {
      history.push('/entry?uid=' + searchParam('uid', this.props.location))
      return
    }
    if (socket.disconnected) {
      socket.open()
    }
    return socket
  }
  componentDidMount() {
    const socket = this.keepSocket()
    socket?.emit('result', { uid: searchParam('uid', this.props.location) }, (res) => {
      console.log('result', res)
    })
      .close()
    const results = JSON.parse(window.localStorage.getItem('pkresult'))
    console.log('results', results)
    this.setState({
      winner: results?.winner,
      detail: results?.result.map(item => {
        return {
          total: item.total,
          score: item.score,
          uid: item.uid,
          nickname: item.nickname
        }
      })
    }, () => {
      setTimeout(() => {
        window.socket?.close()
      }, 300)
    })
  }
  render() {
    const { winner, detail } = this.state
    const questions = window.localStorage.getItem('questions')
    return (
      <div className="page result">
        <div className="pk-result">
          <p className="result-title">获胜者</p>
          <h3 className="winner-name">{winner?.nickname}</h3>
          <p className="detail-title">详情</p>
          <div className="flex-between">
            {detail?.map(item => (
              <div className="detail-item" key={item.uid}>
                <DetailRow left={searchParam('uid', this.props.location) === item.uid ? '本人' : '对手'} right={item.nickname} />
                <DetailRow left="总分" right={item.total} />
                {/* <p className="ellipse-text"><span>{searchParam('uid', this.props.location) === item.uid ? '本人' : '对手'}</span>: <span>{item.nickname}</span></p> */}
                {/* <p>总分: {item.total}</p> */}
                {
                  questions && JSON.parse(questions).map((question, index) => {
                    return <DetailRow key={index} left={`题${index + 1}`} right={item.score[question.qid] || 0} />
                    // <p key={index}>题{index + 1}:{item}</p>
                  })
                }
              </div>
            ))}
          </div>
        </div>
        <div className="flex-center">
          <a role="button" aria-disabled="false" className="button" onClick={this.replay}>再来一局</a>
        </div>
      </div>
    )
  }
}
