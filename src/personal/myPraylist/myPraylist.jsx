import React from 'react'
import { WhiteSpace, Card, WingBlank,Modal } from 'antd-mobile'
import {connect} from 'react-redux'

import {timeLongCount,duringDictionary,timeFormat,showToast,
    // directionDictionary,cengConvert,continueLamp 
} from '../../util'
import Order from '../../service/order-service.jsx'
import {savePrayList} from '../../redux/pray.redux'
import  "./myPraylist.less"
const _order = new Order()
@connect(
    state=>state.prayList,
    {savePrayList}
)
class MyPraylist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            praylist : this.props.prayList
        }
    }

    componentDidMount(){
        if(this.props.prayList.length===0){
            _order.getOrderList().then(res=>{
                if(res.status === 200){
                    this.setState({praylist : res.data})
                    this.props.savePrayList(res.data)
                }
            })
        }
    }

    handleDeleteClick(id,e){
        e.stopPropagation()
        Modal.alert('删除', '确认删除订单？', [
            { text: '取消' },
            { text: '确认', onPress: () => {
                _order.deleteOrder(id).then(res=>{
                    if(res.status === 200&&res.data.returnCode===1000){
                        const praylist = this.state.praylist.filter(v=>v.id!==id)
                        this.setState({praylist})
                        this.props.savePrayList(praylist)
                    }
                    showToast(res.data.data)
                })
            } },
        ])
    }

    handleContinueClick(id,fid,e){
        e.stopPropagation()
        window.location.href = `/pay/prayForm?pid=${id}#${fid}`
    }

    render(){
        return (
            <div>
                <WhiteSpace/>
                <WingBlank size="lg">
                    {this.state.praylist.map((v,idx)=>
                        <div key={v.id}>
                            <Card full className='radius prayLi' 
                                // onClick={()=>this.props.history.push(`/prayDetail#${v.id}`)}>
                                onClick={()=>window.location.href = `/pay/prayDetail#${v.id}`}>
                                {/* <div className='prayHead orangeBg'>{v.blessing}</div> */}
                                <Card.Body>
                                    <div className='prayTitle'>
                                        <div className='imgBlock'><img src={require('./fo.jpg')||v.tico} alt="" style={{width:'100%'}} /></div>
                                        <div className='titBlock'>
                                            <div className='name'>{v.tname} {v.fname}</div>
                                            {/* {v.dengwei.map((val,idx2)=>
                                                <div key={idx2} className='spand'>
                                                    <span className='lampIcon l-shan tini'></span>
                                                    {directionDictionary(val.side-1)}{cengConvert(val.row-1,val.maxrow||15)}层{('0'+val.col).slice(-2)}位
                                                </div>
                                            )} */}
                                            <div className='pt-5'>供灯数量：{v.dengwei.length}盏</div>
                                            <div className='pt-5'>供灯时间：{duringDictionary().find(x=>x.type===v.duration).name}</div>
                                            <div className='pt-5'>供灯功德：{(v.sum/100).toFixed(2) }元</div>
                                        </div>
                                    </div>
                                    
                                    { v.payStatus!==2?v.payStatus!==3?
                                        <div>支付状态：<span className='c-red b'>未支付</span></div>
                                        :
                                        <div>支付状态：<span className='c-red b'>支付超时</span></div>
                                        :
                                        <div>
                                            <div className='pt-5'>供灯剩余时间：{timeLongCount(v.payTime,v.closeTime,true)}</div>
                                            <div className='pt-5'>供灯开始时间：{timeFormat(v.payTime).toLocaleString()}</div>
                                            <div className='pt-5'>供灯结束时间：{timeFormat(v.closeTime).toLocaleString()}</div>
                                        </div>
                                            
                                    }
                                    <div className='btnRow'>
                                        <div className='lf' onClick={(e)=>this.handleDeleteClick(v.id,e)}>
                                            <div className='btn btnred'>删除订单</div>
                                        </div>
                                        {/* <div className='ct' onClick={(e)=>this.handleContinueClick(v.id,v.fid,e)}>
                                            { continueLamp(v.closeTime) ?
                                                <div className='btn btngold'>续灯</div>:''
                                            }
                                        </div> */}
                                        <div className='rt'>查看详情 > </div> 
                                    </div>
                                </Card.Body>
                            </Card>
                            <WhiteSpace/>
                        </div>
                    )}
                    <div className={`emptyList ${this.state.praylist.length===0?'':'hidden'}`}>
                        <span className='lampIcon l-grey img'></span>
                        祈福列表为空
                        <span className='btnbrown' onClick={()=>window.location.href = `/templeList`}>去供灯</span>
                    </div>
                </WingBlank>
            </div>
        )
    }
}

export default MyPraylist;