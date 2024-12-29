import React, { Component } from 'react'
import history from '../../utils/history'
import { searchParam, animate, delay } from '../../utils'
import toast from '../../utils/toast'
import './style.scss'

class Battle extends Component {
  answerEnum = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
  }
  state = {
    question: null,
    questionIndex: 0,
    answer: -1,
    theRightAnswer: -1,
    selectedClass: 'selected',
    time: 10,
    playerName: 'player',
    opponentName: 'opponent',
    playerScore: 0,
    playerSelect: -1,
    opponentScore: 0,
    opponentSelect: -1,
    gameLength: 5
  }
  socreCounter = (callback, start = 0, end = 10000, duration = 1000) => {
    let funcNameHere = function (elapsed) {
      let dynamic = Math.ceil(elapsed * end / duration)
      dynamic = dynamic < start ? dynamic + start : dynamic
      callback && callback(Math.min(dynamic, end))
      return (dynamic < end)
    };
    animate(funcNameHere, duration);
  }
  keepSocket = () => {
    let socket = window.socket
    if (!socket) {
      history.replace('/entry?uid=' + searchParam('uid', this.props.location))
      return
    }
    if (socket.disconnected) {
      socket.open()
    }
    return socket
  }
  generateTimerStream = (delay = 0, hookSubject) => {
    const OB = window.Rx.Observable
    const start = 10
    const timerStream = OB.timer(delay, 1000) // timer(Delay, interval) 
      .merge(hookSubject)
      .map(i => {
        if (typeof i === 'string') {
          return { allSelected: true }
        }
        return {
          count: start - i
        }
      })
      .takeWhile(x => {
        if (x.allSelected) return false
        return x.count >= 0
      })
    // .take(start + 1)

    return timerStream
  }
  generateQuestionStream = (questions) => {
    const OB = window.Rx.Observable
    const qstream = OB.from(questions)

    return qstream
  }
  generateSelectStream = () => {
    return new window.Rx.Subject()
  }
  generateOpponentAnswerStream = () => {
    const OB = window.Rx.Observable
    const rightStream = OB
      .of({
        opponentAnswer: 1,
      })

    return rightStream
  }
  generateQuestionInterval = () => {
    const OB = window.Rx.Observable
    let tips = '即将进入下一题'

    return OB.timer(2000).concat(OB
      .of({
        next: tips,
      }))
      .concat(OB.timer(2500))
  }
  generateStartStream = () => {
    const OB = window.Rx.Observable
    return OB.timer(3000).concat(OB.of({ start: true }))
  }
  generateEndStream = () => {
    const OB = window.Rx.Observable
    return OB.timer(3000).concat(OB.of({ end: true }))
  }
  getQuestions = () => {
    return new Promise((resolve, reject) => {
      this.keepSocket()?.emit('question', { uid: searchParam('uid', this.props.location) }, ({ questions }) => {
        this.setState({
          gameLength: questions.length
        })
        window.localStorage.setItem('questions', JSON.stringify(questions))
        resolve(questions)
      })
    })

  }
  getOpponentScore = (socket) => {
    return window.Rx.Observable.fromEvent(socket, 'opponentScore').map(item => {
      return {
        ...item,
        opponentScore: item.score
      }
    })
  }
  setPlayerScore = (score, selectedOption, qid) => {
    const socket = this.keepSocket()
    if (socket.connected) {
      socket.emit('playerScore', {
        uid: searchParam('uid', this.props.location),
        score,
        qid,
        selectedOption
      }, function (res) {
        // toast.show('score set ' + res.msg)
        console.log(res)
      })
    } else {
      delay(500).then(() => {
        socket.emit('playerScore', {
          uid: searchParam('uid', this.props.location),
          score,
          qid,
          selectedOption
        }, function (res) {
          // toast.show('score set ' + res.msg)
          console.log(res)
        })
      })
    }
  }
  setSelect = (selected, { answer, qid }) => {
    const { playerSelect } = this.state
    if (playerSelect !== -1) return
    const anEnum = this.answerEnum
    const isRightAnswer = anEnum[answer] === selected

    this.setState({
      playerSelect: selected
    })
    this.clickStream.next({
      scored: isRightAnswer,
      select: anEnum[selected],
    })
    delay(1000).then(() => {
      this.setState({
        selectedClass: isRightAnswer ? 'right' : 'wrong'
      })

    })
  }
  async componentDidMount() {
    const socket = this.keepSocket()

    this.setState({
      playerName: searchParam('player', this.props.location),
      opponentName: searchParam('opponent', this.props.location),
    })
    const hookSubject = new window.Rx.Subject()
    const OB = window.Rx.Observable
    const questions = await this.getQuestions()
    // 题目流
    const questionStream = this.generateQuestionStream(questions.sort((a, b)=> (a.qid*1 - b.qid*1)))
    // 时间流
    const timeStream = this.generateTimerStream(500, hookSubject)
    // 题目间隔流
    const questionIntervalStream = this.generateQuestionInterval()
    // 玩家选择答案的事件流
    const playerSelectStream = this.clickStream = this.generateSelectStream()
    // 对手选择答案的事件流
    const opponentSelectStream = this.getOpponentScore(socket)
    // 正确答案流
    const opponentAnswerStream = this.generateOpponentAnswerStream()
    // 开始流
    const beginStream = this.generateStartStream()
    // 结束流
    const endStream = this.generateEndStream()

    const finalStream = questionStream
      .concatMap((q, index) => {
        return OB.of({ question: q, qindex: index })
          .concat(timeStream)
          .concat(OB.timer(2000))
          .concat(opponentAnswerStream)
          .concat(questionIntervalStream)
      })
      .concat(endStream)
      .merge(opponentSelectStream)
      .merge(playerSelectStream)
      .startWith(beginStream)

    let opponentData = null

    finalStream.subscribe(data => {
      if (data.hasOwnProperty('count')) {
        this.setState({
          time: data.count
        })
      }
      if (data.hasOwnProperty('question')) {
        this.setState({
          question: data.question,
          questionIndex: data.qindex,
          playerSelect: -1,
          selectedClass: 'selected',
          opponentSelect: -1,
          theRightAnswer: -1,
        })
      }
      if (data.hasOwnProperty('scored')) {
        const { playerScore, time, question, questionIndex, gameLength } = this.state;

        let currentScore = 0
        if (data.scored) {
          currentScore = 200 - 20 * (10 - time)
        }
        if (questionIndex === gameLength-1){
          currentScore*=2
        }

        this.setPlayerScore(currentScore, data.select, question?.qid)

        this.socreCounter((num) => {
          this.setState({
            playerScore: num
          })
        }, playerScore, currentScore + playerScore)

        if (opponentData) {
          hookSubject.next('allSelected')
        }
      }
      if (data.hasOwnProperty('opponentScore')) {
        const { opponentScore, playerSelect } = this.state
        opponentData = data
        this.socreCounter((num) => {
          this.setState({
            opponentScore: num,
          })
        }, opponentScore, data.opponentScore + opponentScore)

        if (playerSelect !== -1) {
          hookSubject.next('allSelected')
        }
      }
      if (data.hasOwnProperty('opponentAnswer')) {
        const anEnum = this.answerEnum
        
        if (opponentData) {
          this.setState({
            opponentSelect: anEnum[opponentData.selectedOption],
          })
          opponentData = null
        }
      }

      if (data.hasOwnProperty('next')) {
        const questionIndex = this.state.questionIndex + 1
        const gameLength = this.state.gameLength
        const anEnum = this.answerEnum
        this.setState({
          theRightAnswer: anEnum[this.state.question.answer],
        })
        if (questionIndex === gameLength-1){
          return toast.show('最后一题，得分翻倍哦')
        } 
        if (questionIndex > gameLength-1){
          return toast.show('答题结束')
        }
        return toast.show(data.next)
        
      }
      if (data.hasOwnProperty('end')) {
        const { opponentScore, playerScore } = this.state
        this.setState({
          time: null
        })
        socket.emit('result', { uid: searchParam('uid', this.props.location), }, (results) => {
          window.localStorage.setItem('pkresult', JSON.stringify(results))
        })
        const tips = playerScore === opponentScore ? 'Game ends in a draw ~' : (playerScore > opponentScore ? 'Congratulations You Win!' : 'Sorry You Failed!')
        toast.show(tips, 2500).then(() => {
          history.replace(`/result?uid=${searchParam('uid', this.props.location)}`)
        })
      }
    })
  }
  render() {
    const { question, playerName, opponentName, playerSelect, theRightAnswer, selectedClass, time, playerScore, opponentSelect, opponentScore } = this.state

    const options = question?.options?.replace(/\s+/g, '').replace(/([BCD])/g, '~!~$1').split('~!~')?.map(item => {
      return item.slice(1)
    }) || []

    return (
      <div className="page battle">
        <div className="battle-score">
          <div className="battle-gamer gamer-left">

            <div className="battle-player">
              <div className="battle-info">
                <span className="player-name ellipse-text">{playerName}</span>
              </div>
              <div className="battle-step">{playerScore}</div>
            </div>
          </div>
          {time === null ? <div className="battle-icon"></div> : <div className="count-down"><div className="count-down-inner">{time}</div></div>}
          <div className="battle-gamer gamer-right">
            <div className="battle-player">
              <div className="battle-info">
                {/* <span className="score"></span> */}
                <span className="player-name ellipse-text">{opponentName}</span>
              </div>
              <div className="battle-step">{opponentScore}</div>
            </div>
          </div>
        </div>
        <div className="battle-question">
          <div className="stripes angled-135">
            <span>{question?.title}?</span>
          </div>
        </div>
        <div className="question-options">
          {
            options.map((item, index) => <div
              className={`option 
              ${(theRightAnswer === -1 && playerSelect === index) ? selectedClass : ''}
              ${theRightAnswer === index ? 'right' : ''}
              ${opponentSelect === index ? 'opponent-select' : ''}
              ${playerSelect === index ? 'player-select' : ''}`}
              key={index}
              onClick={() => this.setSelect(index, question)}
            >{item}</div>)
          }
        </div>
      </div>
    )
  }
}

export default Battle
