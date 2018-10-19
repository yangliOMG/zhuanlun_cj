import React from 'react'
import {connect} from 'react-redux'
import { WhiteSpace } from 'antd-mobile'

import { newOrder} from '../../redux/order.redux'
import Tem from '../../service/temple-service.jsx'

import './gridDefine.less'

const _temple = new Tem()

@connect(
    state=>state,
    {newOrder}
)
class Temple extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            temple : {},
            facility:[],
            templeMaterial:[],
            active:null
        }
    }
    componentWillMount(){
        const id = this.props.location.hash.replace("#","")
        _temple.getHistoryByType(0)
        .then(res=> (id||res.data.oid)? 
            _temple.getTempleById(id||res.data.oid,true):
            window.location.href = '/templeList'
        ).then(res=>{
            if(res.status === 200&&res.data.temple.length>0){
                let active = res.data.facility.length>0? res.data.facility[0].facility.id:null
                this.setState({
                    ...res.data,
                    temple : res.data.temple[0],
                    active,
                })
                document.title = this.state.temple.name
            }
        })
    }
    handleClickPray(e){
        e.preventDefault()
        this.props.newOrder()
        let id = this.state.active
        if(id){
            window.location.href = `/pay/prayForm?src=${1}#${id}`
        }
        // this.props.history.push(`/pay/prayForm#${id}`)
    }
    handleChannelActive(id, e){
        e.preventDefault()
        this.setState({
            active:id,
        })
    }

    render(){
        const { temple, facility, templeMaterial, active } = this.state
        let rowData = [],hang=[];
        facility.forEach((val,idx)=>{
            if(idx%2===0){
                hang=[];
                hang.push(val)
                rowData.push(hang)
            }else{
                hang.push(val)
            }
        })
        return (
            <div>
                <div>
                    <img width='100%' src={temple.ico||require('./linyinsi.jpg')} alt="" />
                </div>
                <div className='d-pannel radius'>
                    <div className='name'>{temple.name}祈福塔</div>
                    {
                        facility.length===1?
                        <div className="d-flexbox" onClick={(e)=> this.handleChannelActive(facility[0].facility.id,e)}>
                            <div className='temCard radius'>
                                <div className='img active'>   
                                    <img className='ico' src={facility[0].facility.ico||require('./tower.jpg')} alt="" />
                                    <img className="d-active" src={require('./active.png')} alt=""/>
                                </div>
                                <div className='ti'>
                                    <div className='title'>{facility[0].facility.tname+' '+ facility[0].facility.name}</div>
                                    <div className="d-tips">
                                        <span className='lampIcon l-shan tini'></span>{facility[0].bright}&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span className='lampIcon l-bushan tini'></span>{facility[0].lightNum-facility[0].bright}
                                    </div>
                                    <div className="d-qifu orangeBtn">我要祈福</div>
                                </div>
                            </div>
                        </div>
                        :
                        rowData.map((row,idx)=>
                            <div className="d-flexbox" key={idx}>
                                {row.map((v,idx)=>
                                    <div className="d-flexitem" key={v.facility.id} 
                                        onClick={(e)=> this.handleChannelActive(v.facility.id,e)}>
                                        <div className={`d-content ${active===v.facility.id?"active":""}`}>
                                            <img className="d-img" src={v.facility.ico||require('./tower.jpg')} alt=""/>
                                            <img className="d-active" src={require('./active.png')} alt=""/>
                                            <div className="d-text">
                                                <div className="d-name">{v.facility.tname+' '+ v.facility.name}</div>
                                                <div className="d-tips">
                                                    <span className='lampIcon l-shan tini'></span>{v.bright}&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span className='lampIcon l-bushan tini'></span>{v.lightNum-v.bright}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
                
                <div className='titlecard radius'>
                    <div className='title'>
                        <div className='name'>关于寺院</div>
                        <div className='c-erji info'>
                            {templeMaterial.filter(v=>v.name!=='主持').map((v,idx)=>
                                v.content
                            )}
                        </div>
                    </div>
                </div>
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <div className={`stick-footer ${active===null?"hide":""}`}
                    onClick={(e)=> this.handleClickPray(e)}>  
                    我要祈福
                </div>
            </div>
        )
    }
}

export default Temple;