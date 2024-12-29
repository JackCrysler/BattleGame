import React from 'react'
import SectionTitle from '~/components/sectionTitle'
import history from '~/utils/history'
import './style.scss'

const RecordItem = ({ title, content, className = "" }) => (
    <p className={"record-item " + className}>
        <span className="record-item-title">{title}</span>
        <span className="record-item-content">{content}</span>
    </p>
)


function Record() {
    const pkinfo = window.localStorage.getItem('pklist')
    const PKHistroy = pkinfo ? JSON.parse(pkinfo) : {}
    const { msg = {}, pklist = [] } = PKHistroy;

    return (
        <div className="record-page flex-column">
            <SectionTitle title="Player Profile" algin="center"/>
            <SectionTitle title="玩家信息"/>
            <div className="personal-info">
                <RecordItem title="昵称" content={msg.nickname} />
                <RecordItem title="账号" content={msg.username} />
                <RecordItem title="头像" content={<img className="user-avatar" src={msg.portrait_url} alt="avatar"/>} />
                <RecordItem title="游戏次数" content={msg.pktimes} />
                <RecordItem title="胜率" content={Math.ceil(msg.winning_count * 100 / msg.pktimes) + '%'} />
                <RecordItem title="拥有能量" content={msg.power} />
                <RecordItem title="注册日期" content={new Date(msg.create_date).toLocaleString()} />
            </div>
            <SectionTitle title="Recent Players"/>
            <div className="battle-history">
                {
                    pklist.map((it, idx) => {
                        return <RecordItem key={idx} title="昵称" content={it.nickname || it.username} />
                    })
                }
            </div>
            <div className="go-back">
                <a role="button" onClick={() => history.go(-1)} >点我返回</a>
            </div>
        </div>
    )
}

export default Record