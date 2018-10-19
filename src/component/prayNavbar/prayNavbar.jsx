import React from 'react'
import { NoticeBar} from 'antd-mobile'
import {connect} from 'react-redux'
import Order from '../../service/order-service.jsx'
// import {update} from '../../redux/user.redux'
import './prayNavbar.css'

const _order = new Order()
@connect(
    state=>state.user,
    // {update}
)
class PrayNavbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentWillMount(){
        const fid = window.location.hash.replace("#","")
        _order.getTopMes(fid).then(res=>{
            if(res.status === 200){
                const data = res.data.data
                this.setState({data})
            }
        })
    }

    render(){
        return (
                <NoticeBar 
                    mode="link" 
                    icon={null} 
                    action={ <div> </div>}
                    marqueeProps={{ loop: true, style: { padding: '0 10px', fontSize:16 }}}
                >
                    {
                        this.state.data.map((v,idx)=>
                            <span key={idx} className='mr-30'><span className='c-white'>{v.prayman}</span>供灯{v.lednums}盏</span>
                        )
                    }
                </NoticeBar>
        )
    }
}

export default PrayNavbar;