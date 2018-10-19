import React from 'react'
import { WhiteSpace  , SearchBar, WingBlank, NavBar,Icon} from 'antd-mobile'
import {connect} from 'react-redux'
// import {Redirect} from 'react-router-dom'

import {updateOrder} from '../../redux/order.redux'
import Order from '../../service/order-service.jsx'

import './template.css'
const _order = new Order()

@connect(
    state=>state.user,
    {updateOrder}
)
class Template extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type:'',
            templateList:[]
        }
    }
    componentDidMount(){
        this.ajaxTemplateList()
    }
    ajaxTemplateList(type=1,content='s'){
        _order.getTemplateList({type,content}).then(res=>{
            if(res.status === 200){
                this.setState({
                    templateList: res.data
                })
            }
        })
    }

    handleSearchBarChange(v){
        this.ajaxTemplateList(1,v)
    }
    handleChoose(type){
        this.setState({
            type
        })
    }
    handleClick(e){
        this.props.updateOrder({blessing:e.target.innerHTML})
        this.props.onClose({blessing:e.target.innerHTML})
    }
    render(){
        
        const typeList = [{type:'1',name:'福寿'},{type:'2',name:'福禄'},{type:'3',name:'健康'},
                        {type:'4',name:'财富'},{type:'5',name:'姻缘'},{type:'6',name:'考试'}]
        const templateList = this.state.templateList             
        return (
            <div>
                <NavBar 
                    icon={<Icon type="left" />} 
                    mode='dard' 
                    onLeftClick={()=>this.props.onClose()}
                    >祈福语</NavBar>
                <SearchBar
                    placeholder="关键字搜索"
                    onChange={v=>this.handleSearchBarChange( v )}
                />
                <WingBlank size="lg">
                    <div className="board">
                        {typeList.map((v,idx)=>
                            <div style={{flex: '1 1',color: `${this.state.type===v.name?'red':''}` }} 
                                onClick={()=>this.handleChoose(v.name)}
                                key={v.type}>{v.name}</div>
                        )}
                    </div>
                </WingBlank>
                <WhiteSpace size="sm" />
                <WingBlank size="sm">
                    {templateList.map((v,idx)=>
                        <a className="row" key={v.id}
                            onClick={(e)=>this.handleClick(e)}
                        >{v.content}</a>
                    )}
                </WingBlank>

            </div>
        )
    }
}

export default Template;