import React from 'react'
import { Tabs } from 'antd-mobile';

import { cengConvert } from '../../util'

let x1 = 0, x2 = 0, y1 = 0, y2 = 0, move = false

class TabEx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    touchCount(x, v) {
        if (x === 'x2') {
            x2 = v.pageX
            y2 = v.pageY
            move = true
        } else if (x === 'x1') {
            x1 = v.pageX
            y1 = v.pageY
        }
    }
    slideCount(idx) {
        let changeX = x2 - x1,
            changeY = y2 - y1
        if (Math.abs(changeX) > 50 && move && Math.abs(changeX) > Math.abs(changeY)) {
            if (changeX > 0) {  //左滑
                this.props.turnPage(idx === 0 ? 7 : idx - 1)
            } else if (changeX < 0) {   //右滑
                this.props.turnPage(idx === 7 ? 0 : idx + 1)
            }
        }
        x1 = 0
        x2 = 0
        y1 = 0
        y2 = 0
        move = false
    }


    render() {
        const data = this.props.data
        const tabs2 = data.map((i, idx) => ({ title: idx + 1 + ' Tab', sub: idx + 1 + '' }))
        const tabHeight = document.documentElement.clientHeight - 233
        //  <div style={{position:'absolute',top:'-20px',left:'-20px',right:'-20px',bottom:'-20px',background:`url(${require('./tower.png')}) ` }}></div> 
        return (
            <Tabs tabs={tabs2}
                initialPage={this.props.curPage} page={this.props.curPage}
                // onChange={(tab, idx) => this.props.turnPage(toPage)}
                // 在添加onTouchStart等事件后，Tabs的onChange事件，在首尾屏上下滚动的时候，就会莫名触发翻页，所以屏蔽掉
                renderTabBar={false}
            >
                {data.map((darr, idx) =>
                    <div key={idx} className='lampTab' style={{ minHeight: `${tabHeight}px` }}>
                        <div className='lampBord'>
                            <div className='rowNum'>
                                {darr.map((arr, idx1) =>
                                    <div key={idx1} className='tableRow'>
                                        <div className='row'>
                                            {('0' + cengConvert(idx1, darr.length)).slice(-2)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='lampPannel'
                                onTouchEnd={() => this.slideCount(idx)}
                                onTouchStart={e => this.touchCount('x1', e.targetTouches[0])}
                                onTouchMove={e => this.touchCount('x2', e.targetTouches[0])}
                            >
                                {darr.map((arr, idx1) =>
                                    <div key={idx1} style={{ display: 'table-row' }}>
                                        {arr.map((v, idx2) => <div key={idx2} style={{ display: 'table-cell' }}>{v.state !== 0 ? v.state !== 1 ?
                                            <span className={`lampIcon l-red mini`} onClick={() => this.props.seatSelection(idx, idx1, idx2)}></span> :
                                            <span className={`lampIcon l-gong-mini mini`}></span> :
                                            <span className={`lampIcon l-grey mini`} onClick={() => this.props.seatSelection(idx, idx1, idx2)}></span>
                                        }</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                )}


            </Tabs>
        )
    }
}
export default TabEx;
