import React from 'react'
import SectionTitle from '~/components/sectionTitle'
import './style.scss'

function Learnmore() {
    return (
        <div className="learnmore-page">
            <SectionTitle title="More Instructions" algin="center"/>
            <div className="technology-statement">
                
                <p className="technology-statement-item">
                    <span className="technology-statement-item-title">开发背景：</span>
                    <em className="technology-statement-item-content">
                        某一天公司组织技术分享。在梳理了一遍前端技术后，最终选择了Rxjs。至于原因，一是怕深度的东西怕讲不到位，二是全面的东西整理起来费时费力。
                    </em>
                    <em className="technology-statement-item-content">
                        查了Rxjs相关资料后，发现它属于用得少但又有点意思的技术，对于涉及到复杂异步流程的应用会有如虎添翼的效果。网上关于Rxjs的实际应用案例几乎没有，能找到的仅是一些基础的demo。所以我决定根据其特性实际探索一番，方案就是开发一款仿头脑王者的HTML5应用。
                    </em>
                </p>
                <p className="technology-statement-item">
                    <span className="technology-statement-item-title">开发原则：</span>
                    <em className="technology-statement-item-content">简单而有效</em>
                </p>
                <p className="technology-statement-item">
                    <span className="technology-statement-item-title">技术介绍：</span>
                    <em className="technology-statement-item-content">
                        开发环境，基于React官方脚手架微定制而来，ReactRouter配置前端路由，全局挂载socket实例。
                        Rxjs来管理异步流，通过合理设计将游戏PK过程中的定时器，实时状态，玩家数据等异步状态按次序排布，充分利用Rxjs的能力，达到了用清晰的逻辑管理复杂异步的目的。
                    </em>
                    <em className="technology-statement-item-content">
                        前端仅react + rxjs + socket.io，无多余的第三方库，尽量减小打包后体积。
                        后端基于Node仅koa + mysql + socket.io，自己写了一个缓存队列来代替redis，没用egg是因为不需要。
                    </em>
                    <em className="technology-statement-item-content">
                        由于一个域名下部署了多个服务，所以采用了nginx进行路由分发，使用scp2实现一键部署。
                    </em>
                </p>
                <div className="technology-statement-item">
                    <span className="technology-statement-item-title">核心技术栈：</span>
                    <em>- react</em>
                    <em>- react-router-dom</em>
                    <em>- rxjs</em>
                    <em>- socket.io</em>
                    <em>- koa</em>
                    <em>- koa-router</em>
                    <em>- mysql</em>
                    <em>- nginx</em>
                    <em>- nanoid</em>
                </div>
                <p className="technology-statement-item">
                    <span className="technology-statement-item-title">Contact Me：</span>
                    <em className="technology-statement-item-content">
                        jack_crysler@163.com
                    </em>
                </p>
            </div>
            <div className="go-back">
                <a href="#/" >点我返回</a>
            </div>
        </div>
    )
}

export default Learnmore