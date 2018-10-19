import React from 'react'
import { List, WhiteSpace , WingBlank} from 'antd-mobile'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome';
import { removeStorage,getStorage } from '../../util'
import Order from '../../service/order-service.jsx'
import {savePrayList} from '../../redux/pray.redux'

// import {update} from '../../redux/user.redux'
import "./personalCenter.css"
const _order = new Order()
@connect(
    state=>state,
    {savePrayList}
)
class PersonalCenter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        if(this.props.prayList.prayList.length===0){
            _order.getOrderList()
        }
    }

    handleClick(){
        if(false){
            removeStorage('user');alert('清除缓存')
        }
    }

    render(){
        const Item = List.Item
        const namelist = [
                {title:"我的祈福",path:'/myPraylist',fontname:'heart',style:{}},
                // {title:"我的收藏",path:'/myCarelist',fontname:'star',color:'orange'},
                {title:"我的足迹",path:'/myHistory',fontname:'eye',style:{}},
                {title:"手机绑定",path:'/myPhone',fontname:'mobile',style:{fontSize:"22px"}},
                {title:"意见反馈",path:'/mySuggest',fontname:'commenting',style:{}},
            ]
        const headImg = this.props.user.headImgURL || getStorage('user').headImgURL
        const nick = this.props.user.nick || getStorage('user').nick
        return (
            <div>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td><div className="headImgDiv mt-15" onClick={()=>this.handleClick()}>
                                <img id="img" height="60" width="60" src={headImg||require("./default_photo.jpg")} alt="" />
                            </div></td>
                        </tr>
                        <tr>
                            <td><div className='text-c f-16'>{nick||"登录"}</div></td>
                        </tr>
                    </tbody>
                </table>  
                <WhiteSpace/>
                <WingBlank className='radius list'>
                    <List>
                        {namelist.map((v,idx)=>
                            <Item key={v.path}
                                arrow="horizontal" 
                                onClick={() => this.props.history.push(v.path)} 
                                thumb={<div className="border"><FontAwesome name={v.fontname} style={{...v.style}} /></div>}
                            >{v.title}</Item>
                        )}
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default PersonalCenter;