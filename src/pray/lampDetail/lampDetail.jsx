import React from 'react'
import {withRouter} from 'react-router-dom'    
import { Button, Toast } from 'antd-mobile'
import FontAwesome from 'react-fontawesome';
import {connect} from 'react-redux'
import TabEx from  './tabEx.jsx'
import {directionDictionary, recommendAI, showToast, positionMesArray} from '../../util'
import {updateOrder} from '../../redux/order.redux'
import Tem from '../../service/temple-service.jsx'

import './lampDetail.less'

const _temple = new Tem()

@withRouter 
@connect(
    state=>state.order,
    {updateOrder}
)
class LampDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data : [[],[],[]],
            seledList : new Map(),
            curPage:0,
            lastPageHide:false,
            nextPageHide:false,
            activeArrow:false,
        }
    }

    componentWillMount(){
        const num = this.props.num , position = this.props.position
        const id = this.props.location.hash.replace("#","")
        if(id){
            Toast.loading('加载中。。。',0)
            _temple.getLayoutById(id).then(res=>{
                let layout = res.data
                if(res.status === 200){
                    _temple.getOccupyById(id).then(res=>{
                        let occupy = res.data
                        if(res.status === 200){
                            let total = 0
                            this.setState({
                                data: layout.map(arrd=>
                                        arrd.map(arr=>
                                            arr.map(id=>{
                                                total++;
                                                return {id,state: occupy.includes(id)?1:0}
                                            })     //0可选，1不可选，2已选
                                        )
                                ),
                                total,
                                occupy:occupy.length
                            })
                            if(position.length>0){
                                position.forEach((arr,idx)=>this.seatSelection(...arr[1][2].split(',')))
                            }else if(num && num>0){
                                this.handleRecBtnClick(num)
                            }
                        }
                        Toast.hide()
                    })
                }
            })
        }
    }
    scrollToBottom() {
        setTimeout(() => {//滚动到页底
            const $div = document.getElementById('area').getElementsByClassName('am-tabs-pane-wrap-active')[0]||document  
            const $span = $div.getElementsByClassName('l-red')[0]
            if($span){
                $div.scrollTop = $span.offsetTop
            }else if($div){
                $div.scrollTop = $div.scrollHeight - $div.offsetHeight
            }
        }, 200);
    }
    //  ↓↓↓↓↓↓单页应用（SPA）前端javascript如何阻止按下返回键页面回退↓↓↓↓↓↓
    componentDidMount() {
        this.addEventHandler()
    }
    componentWillUnmount() {
        this.removeEventHandler()
    }
    addEventHandler() {
        window.addEventListener('popstate', this.closePopstate, false)
        window.history.pushState({}, '')
    }
    removeEventHandler() {
        window.removeEventListener('popstate', this.closePopstate, false)
    }
    closePopstate = (e) => {
        window.removeEventListener('popstate', this.closePopstate, false)
        this.props.onClose()
    }
    //  ↑↑↑单页应用（SPA）前端javascript如何阻止按下返回键页面回退↑↑↑↑
    handleRecBtnClick(num){
        let data = this.state.data
        let recArrIdx = recommendAI(data,num)
        recArrIdx.forEach((v,idx)=>this.seatSelection(...v))
    }
    
    turnPage(curPage){
        curPage = Number(curPage)
        // const lastPageHide = curPage===0
        // const nextPageHide = this.state.data.length===(curPage+1)
        if(this.state.curPage!==curPage){
            this.scrollToBottom()
        }
        this.setState({
            curPage,
            // lastPageHide,nextPageHide
        })
    }
    seatSelection(idx,idx1,idx2){
        let data = this.state.data
        let seledList = this.state.seledList
        let lampdata = data[idx][idx1][idx2]
        let len = data[idx].length

        if(lampdata.state===0){
            lampdata.state = 2
            seledList.set(lampdata.id, positionMesArray(idx,idx1,idx2,len) )
        }else if(lampdata.state===2){
            seledList.delete(lampdata.id)
            lampdata.state = 0
        }
        this.setState({
            data,seledList
        })
        this.turnPage(idx)
    }
    handleSeatDelete(id){
        // let data = this.state.data
        // data.forEach(arrd=>
        //     arrd.forEach(arr=>
        //         arr.forEach(i=>i.state===2?i.state=0:'' )
        //     )
        // )
        let re = new RegExp('"id":'+id+',"state":2','ig')
        let data = JSON.parse(JSON.stringify(this.state.data).replace(re,'"id":'+id+',"state":0'))
        this.state.seledList.delete(id)
        this.setState({
            data,
            seledList:this.state.seledList
        })
    }
    handleSureSelectClick(){
        const { seledList } = this.state
        const oldnum = this.props.num
        const num = seledList.size
        const value = {position:[...seledList],num}
        if(oldnum>num){
            return showToast(`还要再选${oldnum-num}个位置`,2)
        }
        this.props.updateOrder(value)
        this.props.onClose(value)
        this.props.history.goBack()
    }

    handleArrowClick(type){
        let curPage = this.state.curPage
        this.setState({activeArrow:type})
        setTimeout(() => {
            this.setState({activeArrow:false})
        }, 250)
         type==='left' ? this.turnPage(curPage===0?7:--curPage) : this.turnPage(curPage===7?0:++curPage)
    }

    render(){
        const selednum = this.state.seledList.size, occupy = this.state.occupy||0, can = this.state.total-occupy-selednum||0
        const btnList = [{type:1,name:'1盏'},{type:2,name:'2盏'},{type:3,name:'3盏'},{type:4,name:'4盏'}]
        const data = this.state.data
        return (
            <div className ='bodyBackgroundColor max-h' style={{overflow:"hidden"}}>
                <div className='state-bar'>  
                    {[['l-gong','已供灯位',occupy],['l-red','已选灯位',selednum],['l-grey','可供灯位',can]].map((v,idx)=>
                        <div className='lie' key={v[0]}>
                            <span className={`lampIcon ${v[0]}`}></span><div className='name'>{v[1]}<p>{v[2]}</p></div>
                        </div>
                    )}
                </div>
                <div id='area' className={`area ${selednum===0?'':'b187'}`}>
                    <TabEx data={data} curPage={this.state.curPage}
                        turnPage={(idx)=>this.turnPage(idx)} 
                        seatSelection={(idx,idx1,idx2)=>this.seatSelection(idx,idx1,idx2)}
                    ></TabEx>
                </div>
                <div className="fixed-bar">
                    <div className='field-bar'>
                        <div style={{flex: '1 1'}}></div>
                        <div style={{flex: '12 1'}} className="titleCard">
                            <div className={`leftArrow c-white ${this.state.activeArrow}`} onClick={()=>this.handleArrowClick('left')}>
                                <FontAwesome name={'chevron-left'} className={`${this.state.lastPageHide&&'hidden'}`} />
                            </div>
                            <div className={`rightArrow c-white ${this.state.activeArrow}`} onClick={()=>this.handleArrowClick('right')}>
                                <FontAwesome name={'chevron-right'} className={`${this.state.nextPageHide&&'hidden'}`} />
                            </div>
                            <div className="channel-box" style={{WebkitTransform: `translate(-${this.state.curPage}00%,0)`  }}>
                                {data.map((v,idx)=>
                                    <div className="channel" key={idx}>福佑灯塔 <span className='c-fuzhu'>{directionDictionary(idx)}</span></div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`recom-bar ${selednum!==0&&'hidden'}`}>  
                        <div className='ilshow' style={{flex:'4 1'}}>推荐灯位</div>
                        {btnList.map((v,idx)=>
                            <div className="radiobutton" key={v.type} onClick={()=>this.handleRecBtnClick(v.type)}>{v.name}</div>
                        )}
                    </div>
                    <div className={`pos-bar ${selednum===0&&'hidden'}`}>
                        <div className="nowrap">
                            {[...this.state.seledList].map((v,idx)=>
                                <div className="nameplate bg-fuzhu radius" key={v[0]}>{v[1][0]}
                                    <FontAwesome name={'times-circle'} className='timecircle' size='lg'
                                        onClick={()=>this.handleSeatDelete(v[0])}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`seled-bar`}>  
                        <div className="seled-div bg-red1">
                            <Button className='radiusNo' type="warning" onClick={()=>this.handleSureSelectClick()}
                                >{selednum!==0?('已选'+selednum+'个 '):''}确认祈福</Button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default LampDetail;