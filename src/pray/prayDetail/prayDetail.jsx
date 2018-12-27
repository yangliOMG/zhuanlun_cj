import React from 'react'
import { WhiteSpace ,WingBlank, List ,InputItem,TextareaItem,DatePicker,Picker, Toast, Button } from 'antd-mobile'
import {connect} from 'react-redux'
import District from './area'
import {duringDictionary, dateDictionary, showToast, positionMesArray, timeFormat, timeLongCount } from '../../util'
import Popup from '../../component/userMesTable/userMesTable.jsx'
import {updateOrder} from '../../redux/order.redux'

import Order from '../../service/order-service.jsx'
import User from '../../service/user-service.jsx'
import './prayDetail.less'
import {webchatPay } from '../prayForm/wechatPay.js'

// import asyncComponent from '../../component/dashboard/AsyncComponent'
// const District = asyncComponent(() => import("./area"))
const _order = new Order()
const _user = new User()
@connect(
    state=>state.prayList,
    {updateOrder}
)
class PrayDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            order : {
                num: 2,
                duration:1,
                total:390000,
                unick:"xxx",
                blessing:"身体健康，万事如意",
                type:1,
                dengwei:[],
                tname:'xxx',
                fname:'xxx',
                createTime:'',
            },
            show:false,
            messageModal: false,
            messageModal2: false,
            name:'',
            phone:'',
            sex:'',
            birthday:'',
            address:'',
            thing:'',
            src:'',
            burning:false,
            followFlag:false
        }
    }
    componentWillMount(){
        const id = this.props.location.hash.replace("#","")
        // let order = this.props.prayList.find(v=>v.id===id)
        // if(order){
        //     this.messageInit(order)
        // }else{
            _order.getOrderByid(id).then(res=>{
                if(res.status === 200){
                    this.messageInit(res.data)
                }else{
                    this.props.history.push('/myPraylist')
                }
            })
            _user.judgeIsFollow().then(res=>{
                if(res.status === 200){
                    this.setState({followFlag : res.data})
                }
            })
        // }
    }
    messageInit(order){
        this.setState({order : order})
        if(order.payStatus===2&&order.blissStatus===2){
            this.handleInput('messageModal2',true)
        }else if(order.payStatus!==2){
            _order.getWechatPayCallback({prayId:order.id}).then(res=>{
                if(res.status===200&&res.data.trade_state==='SUCCESS'){
                    this.messageInit({...order,payStatus:2})
                }
            })
        }
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({[key]: true})
    }
    onClose = key => () => {
        this.setState({[key]: false})
    }
    handleInput(key,value){
        this.setState({[key]: value})
    }
    handleSubMes(){
        let blissMan = {}
        let id = this.props.location.hash.replace("#","")
            blissMan.name = this.state.name
            blissMan.phone = this.state.phone
            blissMan.sex = (this.state.sex*1) ||0  //1男 2女 0未知
            blissMan.birthday = dateDictionary(this.state.birthday)
            blissMan.address = document.getElementById('addrPicker').getElementsByClassName('am-list-extra')[0].innerHTML.replace(/,/g,'')
            blissMan.thing = this.state.thing
            blissMan.pid = id
        if(!blissMan.name){
            return showToast('请输入姓名')
        }else if(!blissMan.phone){
            return showToast('请输入电话')
        }else if(!blissMan.sex){
            return showToast('请选择性别')
        }
        Toast.loading('升疏生成中...',0)
        _order.createBlissMan(blissMan).then(res=>{
            if(res.status === 200){
                return 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            }
        }).then(data =>{
            this.setState({src: data})
            Toast.hide()
        })
        this.onClose('messageModal')()
    }
    handleBurning(){
        if(this.state.burning){
            return true
        }
        this.setState({burning: true})
        setTimeout(() => {
            showToast('焚化完成')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }, 8000)
    }
    handleClickReback(){
        const order = this.state.order
        if(order.payStatus===2){
            this.props.history.push('/personalCenter')
        }else if(order.payStatus===1){
            webchatPay({prayId:order.id,sum:order.sum,tid:order.tid})
        }else{
            this.props.history.push('/temple')
        }
    }

    render(){
        const order = this.state.order
        //computed
        const during = duringDictionary().find(v=>v.type===order.duration).name

        return (
            <div>
                <img width='100%' src={require(order.payStatus===2?'./fohou.jpg':'./fohou1.jpg')} alt=""/>
                <WingBlank size="lg">
                    <div className='prayDetail radius'>
                        <div className='prayText'>
                            <div className='c-black1 art'>
                                {order.payStatus!==2?order.payStatus!==3?
                                    <div className='notpay'>未支付 <span>{(order.sum/100).toFixed(2) }元</span></div>
                                        :
                                    <div className='notpay'>支付超时，请重新下单</div>
                                    :
                                    <div><div className="text-incent">
                                    {order.unick}在{order.tname} {order.fname}点亮了{order.dengwei.length}盏佛灯。</div>    
                                    <div className={`text-incent ${order.blessing?'':'hidden'}`}>祝愿：{order.blessing}</div></div>
                                }

                            </div>
                            <div className='inf'>
                                <div className='rightBlock'>
                                    <img width='100%' src={require('./qrcode.jpg')} alt=""/>
                                </div>
                                <div className='leftBlock c-erji'>
                                    <ul className="li">
                                        <li>
                                            <span>● 供灯时长：</span>
                                            <p>{during}</p>
                                        </li>
                                        <li>
                                            <span>● 供灯周期：</span>
                                            <p>{timeFormat(order.payTime).toLocaleString()}~</p>
                                            <p>{timeFormat(order.closeTime).toLocaleString()}</p>
                                        </li>
                                        <li>
                                            <span>● 已供时间：</span>
                                            <p>{timeLongCount(order.payTime,order.closeTime)}</p>
                                        </li>
                                        <li>
                                            <span>● 供灯位置：</span>
                                            {order.dengwei.map(v=>positionMesArray(v.side,v.row,v.col,v.maxrow,"mode1")).map((val,idx)=>
                                                idx>2?null:
                                                <p key={idx}>{
                                                    idx===2?'。。。':
                                                    val[0]
                                                }</p>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>   
                            <div className={`follow ${this.state.followFlag?'hidden':''}`}>
                                <img className='arrow pos-a' width="15px" src={require('./arrow.png')} alt='' />
                                <div className='f-16 c-red'>长按图片 识别二维码关注公众号</div>
                            </div>                    
                        </div>  
                    </div>
                    <WhiteSpace/>
                    <Button type="warning" className="orangeBtn"
                        onClick={()=>this.handleClickReback()}
                    >{order.payStatus!==2?order.payStatus!==3?'去支付':'重新下单':'返回'}</Button>
                </WingBlank>
                <WhiteSpace/>


                <Popup messageModal={this.state.messageModal2} shutdown={this.onClose('messageModal2')}>
                    <div className='messageModal'>
                        <img width='100%' src={require('./message.jpg')} alt=""/>
                        <div className='cha anniu' onClick={this.onClose('messageModal2')}>×</div>
                        <div className='orangeBg anniu sure' onClick={()=>this.setState({messageModal:true,messageModal2:false})}>立即获取</div>
                    </div>
                </Popup>
                
                <Popup messageModal={this.state.messageModal} shutdown={this.onClose('messageModal')}>
                    <div className='messageModal mode2'>
                        <List>
                            <InputItem placeholder="祈福联系人姓名"
                                onChange={v=>this.handleInput('name',v)}
                            >姓名：</InputItem>
                            <InputItem placeholder="祈福联系人电话"
                                onChange={v=>this.handleInput('phone',v)}
                            >电话：</InputItem>
                            <List.Item
                            >性别：
                                <label htmlFor="male" className='radioBlock'>
                                    <input type="radio" name="radio" id="male" onChange={v=>this.handleInput('sex','1')}/>男
                                </label>
                                <label htmlFor="female" className='radioBlock'>
                                    <input type="radio" name="radio" id="female" onChange={v=>this.handleInput('sex','2')}/>女
                                </label>
                            </List.Item>
                            <DatePicker mode="date" title="生日" extra="祈福联系人生日" value={this.state.birthday} 
                                minDate={new Date(1900,1,1)} maxDate={new Date()} onChange={birthday => this.setState({ birthday })}
                                >
                                <List.Item arrow="horizontal">生日：</List.Item>
                            </DatePicker>
                            <Picker extra="所在地区" cols={2}
                                data={District}
                                title="地址选择"
                                value={this.state.address}
                                onOk={address => this.setState({ address })}
                                onChange={address => this.setState({ address })}
                                >
                                <List.Item id='addrPicker' arrow="horizontal">地址：</List.Item>
                            </Picker>
                            <TextareaItem className="textarea" title="祈愿："
                                onChange={v=>this.handleInput('thing',v)}
                                rows={3} autoHeight placeholder={'请输入所求之事'}
                                >
                            </TextareaItem>
                        </List>
                        <div className='btnArea'>
                            <div className='btnBlock'><div className='bg-grey1 btn' onClick={this.onClose('messageModal')}>取消</div></div>
                            <div className='btnBlock'><div className='orangeBg btn' onClick={()=>this.handleSubMes()}>确认</div></div>
                        </div>
                    </div>
                </Popup>

                <div className={`dbssBlock ${this.state.src===''?'hidden':'showin'} ${this.state.burning?'burnings':''}`}>
                    <img src={this.state.src} alt=""/> 
                    <div className={`burnBtn  ${this.state.burning?'bg-grey1':'orangeBg'}`} onClick={()=>this.handleBurning()}>点击开始焚化</div>
                    <div className={`burnBlock ${this.state.burning?'burning':''}`}></div>
                </div>
                
            </div>
        )
    }
}

export default PrayDetail;