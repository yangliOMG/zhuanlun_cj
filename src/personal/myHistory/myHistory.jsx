import React from 'react'
import { WingBlank, WhiteSpace } from 'antd-mobile'
import {connect} from 'react-redux'
import Tem from '../../service/temple-service.jsx'

import logo from '../../pray/temple/foqian.jpg';
// import { StickyContainer, Sticky } from 'react-sticky';

import "./myHistory.less"
const _temple = new Tem()
@connect(
    state=>state.user,
    // {update}
)
class MyHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            historylist : []
        }
    }
    componentWillMount(){
         _temple.getHistoryListByType(0).then(res=>{
            const list = [...new Set(res.data.map(v=>v[3]))]
            const promise = list.map(id=>_temple.getTempleById(id))
            Promise.all(promise).then(res=>{
                let historylist = res.map(i=>i.data)
                this.setState({historylist})
            })
        })
    }

    render(){
        return (
            <div>
                <WhiteSpace/>
                <WingBlank size="lg">
                    <div className='li radius ofhd' onClick={()=>window.location.href = `/templeList`}>
                        <div className='imgBlock'><img src={logo} alt="" /></div>
                        <div className='textBlock'>
                            <div className='b name'>更多寺院</div>
                            <div className="text-overflow4a c-grey1 pt-20">点击前往寺庙列表页</div>
                        </div>
                    </div>
                    {this.state.historylist.map((v,idx)=>
                        // <StickyContainer key={v.id}>
                        //   <Sticky>
                        //     {({style,}) => (
                        //       <header style={{...style,zIndex: 3,backgroundColor: '#eee',
                        //       }}>{v.time}</header>
                        //     )}
                        //   </Sticky>
                        <div key={v.temple[0].id}>
                            <WhiteSpace/>  
                            <div className='li radius ofhd' onClick={()=>this.props.history.push(`/temple#${v.temple[0].id}`)}>
                                <div className='imgBlock'><img src={v.temple[0].ico} alt="" /></div>
                                <div className='textBlock'>
                                    <div className='b name'>{v.temple[0].name}</div>
                                    <div className="text-overflow4a c-grey1">
                                        {v.templeMaterial.filter(v=>v.name!=='主持').map((v,idx)=>
                                            v.content
                                        )}</div>
                                </div>
                            </div>
                        </div>                        

                        // </StickyContainer>  
                    )}
                    <div className={`emptyList ${this.state.historylist.length===0?'':'hidden'}`}>
                        <span className='lampIcon l-grey img'></span>
                        暂无足迹
                        <span className='btnbrown' onClick={()=>window.location.href = `/templeList`}>去看看</span>
                    </div>
                </WingBlank>
            </div>
        )
    }
}

export default MyHistory;