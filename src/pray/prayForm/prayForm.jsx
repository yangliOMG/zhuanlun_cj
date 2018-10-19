import React from 'react'
import { List, WhiteSpace  , Stepper, TextareaItem, Modal, WingBlank, InputItem,Popover} from 'antd-mobile'
import {connect} from 'react-redux'

import PrayNavbar from '../../component/prayNavbar/prayNavbar.jsx'
import LampDetail from '../../pray/lampDetail/lampDetail.jsx'
// import Template from '../../pray/template/template.jsx'

import {updateOrder,newOrder} from '../../redux/order.redux'
import {showToast,duringDictionary,getStorage,directionDictionary,cengConvert,getQueryString } from '../../util'
import {webchatPay } from './wechatPay.js'
import Tem from '../../service/temple-service.jsx'
import Order from '../../service/order-service.jsx'


import './prayForm.css'
import './prayForm.less'
const _temple = new Tem()
const _order = new Order()

@connect(
    state=>state,
    {updateOrder,newOrder}
)
class PrayForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            obj :{},
            num: this.props.order.num,
            price:{
                1:980,
                30:1980,
                365:19900,
                7200:360000
            },
            bright:0,
            lightNum:0,
            unick:getStorage('user').nick,
            duration:this.props.order.duration,
            total:0,
            blessing:this.props.order.blessing,
            position:this.props.order.position,

            textScan:true,
            modal2: false,
            visible: false,
            infoVisible: false,
            positionChangable:true
        }

    }
    componentWillMount(){
        let id = this.props.location.hash.replace("#","").replace(/[^0-9a-zA-Z]/g,'')
        let pid = getQueryString("pid")
        if(pid){
            _order.getOrderByid(pid).then(res=>{
                if(res.status === 200){
                    let dengwei = res.data.dengwei, fid = res.data.fid
                    let position = dengwei.map(v=>([
                        v.address,
                        [`${directionDictionary(v.side-1)}${cengConvert(v.row-1,v.maxrow||15)}层第${('0'+v.col).slice(-2)}位`,
                            `${directionDictionary(v.side-1)}${cengConvert(v.row-1,v.maxrow||15)}${v.col}`,
                            `${v.side-1},${v.row-1},${v.col-1}`]]))
                    _temple.getTowerAndPriceById(fid).then(res=>{
                        if(res.status === 200 && res.data.data.facility){
                            let { facility, price,bright, lightNum } = res.data.data
                            let prices = {}
                            price.forEach(v=>prices[v.duration]=v.price)
                            this.setState({
                                obj: facility,
                                price:prices,
                                bright, 
                                lightNum,
                                position,
                                positionChangable:false
                            })
                        }else{
                            showToast('没有该祈福塔信息')
                        }
                    })
                }
            })
        }else if(id){
            _temple.getTowerAndPriceById(id).then(res=>{
                if(res.status === 200 && res.data.data.facility){
                    let { facility, price,bright, lightNum } = res.data.data
                    let prices = {}
                    price.forEach(v=>prices[v.duration]=v.price)
                    this.setState({
                        obj: facility,
                        price:prices,
                        bright, 
                        lightNum,
                    })
                }else{
                    showToast('没有该祈福塔信息')
                }
            })
            if(this.state.position.length<=0){
                _temple.getRandomPosition(id,this.state.num).then(res=>{
                    if(res.status === 200 && res.data.data){
                        let position = res.data.data.map(v=>([
                            v.address,
                            [`${directionDictionary(v.side-1)}${cengConvert(v.row-1,v.maxrow||15)}层第${('0'+v.col).slice(-2)}位`,
                                `${directionDictionary(v.side-1)}${cengConvert(v.row-1,v.maxrow||15)}${v.col}`,
                                `${v.side-1},${v.row-1},${v.col-1}`]]))
                        this.setState({
                            position,
                        })
                        this.props.updateOrder({position})
                    }else{
                        console.log('无法随机供灯位置')
                    }
                })
            }
        }
    }
    // componentDidMount(){
    //     document.getElementById('stepper').getElementsByClassName('am-stepper-input')[0].setAttribute('disabled',true)
    // }
    
    handleTemplateType(type){
        _order.getRandomTemplateByType(type).then(res=>{
            this.setState({visible:false})
            if(res.status === 200&& res.data.content){
                this.handleTextarea(res.data.content)
                this.handleBlurTextScan()
            }else{
                showToast('暂无该类模板')
            }
        })
        
    }
    handleNumChange(num){
        let position = this.state.position
        if( num < position.length){
            position = position.slice(0,num)
        }
        this.setState({num,position,})
        this.props.updateOrder({num,position})
    }
    handleTimeBtnClick(duration){
        this.setState({duration}) 
        this.props.updateOrder({duration})
    }
    handleInput(unick){
        this.setState({unick})
    }
    handleTextarea(blessing){
        this.setState({blessing})
        this.props.updateOrder({blessing})
    }
    handleBlurTextScan(){
        let blessing = this.state.blessing.replace(/{{prayer}}/g,this.state.unick||'')
        if(blessing!==''&&false){
            _order.getTextScan(blessing).then(res=>{
                if(res.status === 200&& res.data.suggestion==='pass'){
                    this.setState({textScan:true})
                }else{
                    this.setState({textScan:false})
                    if(res.status === 200&& res.data.suggestion==='block'){
                        const dic = {
                            spam:'含垃圾信息',
                            ad:'广告',
                            politics:'涉政',
                            terrorism:'暴恐',
                            abuse:'辱骂',
                            porn:'色情',
                            flood:'灌水',
                            contraband:'违禁',
                            meaningless:'无意义'}
                        showToast('祈愿文内容违规，违规原因：'+dic[res.data.label],3)
                    }
                }
            })
        }else{
            this.setState({textScan:true})
        }
    }
    handlePay(){
        let order = {...this.props.order}
        // order.total = (this.state.price[this.state.duration]||0)* this.state.num
        order.blessing = order.blessing.replace(/{{prayer}}/g,this.state.unick||'')
        order.prayman = this.state.unick
        order.openTime = (new Date()).getTime()
        order.type = 1
        order.adds = order.position.map(i=>i[0])
        order.fid = this.props.location.hash.replace("#","")
        order.source = getQueryString('src')===1? 1:2       //src = 1 入口，src = 2扫码
        if((order.num !== order.position.length)||(order.adds.length<=0)){
            return showToast('请完善供灯位置')
        }
        if(order.duration===""){
            return showToast('请选择时长')
        }
        // if(this.state.textScan===false){
        //     return showToast('祈愿文内容违规')
        // }
        delete order.position
        if(order.blessing&&false){
            _order.getTextScan(order.blessing).then(res=>{
                if(res.status === 200&& res.data.suggestion==='pass'){
                    this.createOrder(order)
                }
            })
        }else{
            this.createOrder(order)
        }
    }
    createOrder(order){
        _order.createOrder(order).then(res=>{
            if(res.data.returnCode===1000){
                this.props.newOrder()
                this.setState({position:[]})
                return webchatPay(res.data.data)
            }else{
                let occ = res.data.data.occ
                if(occ){
                    let position = this.state.position.filter(v=>!occ.includes(v[0]))
                    this.setState({position})
                    this.props.updateOrder({position})
                }
                showToast(res.data.data.errorInfo)
            }
        })
    }

    showModal(key,e){
        e.preventDefault(); // 修复 Android 上点击穿透
        if(this.state.positionChangable){
            this.setState({[key]: true})
            document.getElementById('root').style.overflow ='hidden'// 修复 ios 上滚动穿透
        }else{
            showToast("续灯不可改变位置")
        }
    }
    onClose = key => (value) => {
        this.setState({[key]: false,...value})
        document.getElementById('root').style.overflow =''
    }

    render(){
        const {obj,bright,lightNum } = this.state
        //module
        const Item = List.Item
        const Brief = Item.Brief
        //computed
        const btnList = Object.keys(this.state.price).map(val=>
                            duringDictionary().find(v=>v.type+''===val)
                        )
        const total = (this.state.price[this.state.duration]||0)* this.state.num
        const prayArticle = this.state.blessing.replace(/{{prayer}}/g,this.state.unick||'')
        return (
            <div>
                <PrayNavbar />
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                    <div className='radius ofhd'>
                        <div className='temCard'>
                            <div className='img'>   
                                <img className='ico' src={obj.ico} alt="" />
                            </div>
                            <div className='ti' onClick={()=>this.setState({infoVisible:!this.state.infoVisible})}>
                                <div className='title'>{obj.tname}{obj.name}</div>
                                <div>
                                    <span className='lampIcon l-shan tini'></span>{bright}&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className='lampIcon l-bushan tini'></span>{lightNum-bright}
                                </div>
                            </div>
                            <div className={`info absBlock ${this.state.infoVisible?'':'hidden'}`}
                                onClick={()=>this.setState({infoVisible:false})}>
                                {obj.info}
                                <span className='arrow_wrp'>
                                    <i className='editor_arrow out'></i>
                                    <i className='editor_arrow in'></i>
                                </span>
                            </div>
                        </div>
                        <List>
                            <Item className="def-listitem1" id='stepper'
                                extra={<Stepper style={{ width: '100%', minWidth: '100px' }}
                                                showNumber max={100} min={1}
                                                value={this.state.num}
                                                disabled={!this.state.positionChangable}
                                                onChange={(v) =>this.handleNumChange(v)}
                                        />}
                            >供灯数量</Item>
                            <Item multipleLine >供灯时长
                                <Brief >
                                    <div className="timelongArea">
                                        {btnList.map((v,idx)=>
                                            <div key={v.type} className="btnBlock">
                                                <div className={`timeBtn ${this.state.duration===v.type?'oran':'oran-o'}`}
                                                    onClick={()=>this.handleTimeBtnClick(v.type)}>
                                                    <p>{v.name}</p><p>({(this.state.price[v.type]/100)}元)</p></div>
                                            </div>
                                        )}
                                    </div>
                                </Brief>
                            </Item>
                        </List>
                    </div>
                    <WhiteSpace size="lg" />
                    <List className='radius ofhd'>
                        <Item arrow="horizontal" className="def-listitem"
                            extra={this.state.position.map((v,idx)=>this.state.position.length===idx+1?v[1][1]:v[1][1]+',')}
                            onClick={(e) => this.showModal('modal2', e)}
                        >供灯位置</Item>
                    </List>
                    <WhiteSpace size="lg" />
                    <div className='radius ofhd'>
                        <List>
                            <InputItem placeholder="输入名字"
                                value={this.state.unick}
                                onChange={v=>this.handleInput(v)}
                            >祈愿人：</InputItem>
                            <Item extra={
                                    <Popover mask visible={this.state.visible}
                                        overlay={[
                                                (<Item>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('0')}>通用</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('1')}>平安</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('2')}>智慧</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('3')}>事业</span>
                                                </Item>),(<Item>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('4')}>健康</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('5')}>财富</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('6')}>福寿</span>
                                                    <span className="modeBtn" onClick={()=>this.handleTemplateType('7')}>姻缘</span>
                                                </Item>),
                                            ]}
                                            align={{    
                                                points:['br', 'tr'],//https://github.com/yiminghe/dom-align
                                            }}
                                            onVisibleChange={(visible)=>this.setState({visible})}
                                        >
                                        <div className='moremodule'>更多模板</div>
                                    </Popover>
                                }
                            >祈愿文：
                            </Item>
                            <TextareaItem className="textarea"
                                onChange={v=>this.handleTextarea(v)}
                                onBlur={()=>this.handleBlurTextScan()}
                                rows={3} count={30} autoHeight placeholder={'请输入'}
                                value={prayArticle}
                            />
                        </List>
                        
                    </div>
                </WingBlank>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                
                <div className='stick-footer'>  
                    <div className="total">供灯功德：<span className='c-red'>￥{(total/100).toFixed(2)}</span></div>
                    <a className="payBtn" onClick={()=>{this.handlePay()}}>确认祈福</a>
                </div>


                <Modal visible={this.state.modal2}
                    transitionName ='slide-right'
                    maskTransitionName  ='slide-right'
                    >
                    <LampDetail onClose={this.onClose('modal2')} />
                </Modal>
            </div>
        )
    }
}

export default PrayForm;