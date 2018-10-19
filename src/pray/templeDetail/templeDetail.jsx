import React from 'react'
import { Button, WhiteSpace ,WingBlank} from 'antd-mobile'
import {connect} from 'react-redux'
// import FontAwesome from 'react-fontawesome';

import {showToast } from '../../util'
import Tem from '../../service/temple-service.jsx'

import './templeDetail.less'

const _temple = new Tem()

@connect(
    state=>state.user,
    // {update}
)
class TempleDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            temple : {},
            facility:[],
            templeMaterial:[],
            care:false
        }
    }
    componentWillMount(){
        const id = this.props.location.hash.replace("#","")
        _temple.getTempleById(id).then(res=>{
            if(res.status === 200){
                this.setState({
                    ...res.data,
                    temple : res.data.temple[0]
                })
            }
        })
    }

    handleClick(id){
        this.setState({
            care:!this.state.care
        })
        showToast(!this.state.care?'已收藏':'取消收藏')
    }

    render(){
        const temple = this.state.temple
        const templeMaterial = this.state.templeMaterial
        const zhuchi = templeMaterial.find(v=>v.name==='主持')
        return (
            <div>
                <WingBlank size="lg">
                    <WhiteSpace />
                    <div className='content radius'>
                        <div className='title'>关于<span className="c-orange">寺院</span></div>

                        <div className='name'>
                            <div className='l'>{temple.name}</div>    
                            {zhuchi?
                                <div className={`r`}>主持：{zhuchi.content}</div>:''
                            }
                        </div>
                        <img style={{width: '100%'}} src={temple.ico} alt="" />
                        <div>
                            {templeMaterial.filter(v=>v.name!=='主持').map((v,idx)=>
                                <p key={idx}>{v.content}</p>
                            )}
                        </div>
                        <WhiteSpace />
                    </div>
                </WingBlank>
                
                <WhiteSpace />
                <Button 
                    type="warning" className="orangeBtn"
                    onClick={()=>this.props.history.goBack()}
                    >我要祈福</Button>
                <WhiteSpace size="lg" />
                
            </div>
        )
    }
}

export default TempleDetail;