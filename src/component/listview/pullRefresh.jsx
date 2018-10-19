import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router-dom'
import { PullToRefresh } from 'antd-mobile';
import {connect} from 'react-redux'

import {saveAnchor} from '../../redux/temple.redux'

import './style.less'


// function genData() {
//     const dataArr = [];
//     for (let i = 0; i < 20; i++) {
//       dataArr.push(i);
//     }
//     return dataArr;
//   }

@withRouter
@connect(
    state=>state.praydata,
    {saveAnchor}
)
class Listview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            height: typeof document !== 'undefined' ? document.documentElement.clientHeight : 300 ,
        //   data: [],
        };
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
            // data: genData(),
        }), 0);
    }

    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        this.props.getMore().then(res=>{
            // this.rData = genData()
            this.setState({
                // data: genData(),
                refreshing: false,
                isLoading: false,
            });
        })
    };
    handleClick(id){
        this.props.saveAnchor(`#${id}`)
        this.props.history.push(`/temple#${id}`)
    }

    render() {
        return (
            <div>
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    indicator='上拉可以刷新'
                    direction='up'
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                >
                    {this.props.templeData.map((obj,idx) => (
                        <div id={obj.id} key={obj.id} className='line_box'
                            onClick={()=>this.handleClick(obj.id)}
                        >
                            <div className='img_box'>
                                <img className='img' src={obj.ico} alt="" />
                            </div>
                            <div className='text_box'>
                                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.name}</div>
                                <div className="text-overflow6"></div>
                                <div>
                                    <span>{obj.sect}</span>
                                    <span style={{ marginLeft: 20 }}>{obj.province}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </PullToRefresh>
            </div>);
        }

}

export default Listview;

