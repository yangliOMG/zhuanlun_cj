import React from 'react'
import {withRouter} from 'react-router-dom'
import { ListView,PullToRefresh } from 'antd-mobile';


let pageIndex = 0;

@withRouter
class Listview extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        });
    
        this.state = {
          dataSource,
          isLoading: true,
          hasMore:true,
          refreshing: true,
          rfoot:'block'
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.rData = this.genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false
            });
        }, 600);
    }

    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        this.props.getMore().then(res=>{
            this.rData = this.genData(++pageIndex);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                refreshing: false,
                isLoading: false,
            });
        })
    };

    
    onEndReached = (event) => {
        if (this.state.isLoading || !this.state.hasMore) {
            return;
        }
        this.setState({ isLoading: true })
        this.props.getMore().then(res=>{
            if(res){
                this.rData = this.genData(++pageIndex);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    isLoading: false,
                });
            }else{
                this.setState({ hasMore: false , rfoot:'none'})
            }
        })
    }

    genData(pIndex = 0) {
        let len = this.props.templeData.length
        const dataBlob = {};
        for (let i = 0; i < len; i++) {
            const ii = (pIndex * len) + i;
            dataBlob[`${ii}`] = `row - ${ii}`;
        }
        return dataBlob;
    }

    handleClick(id){
        this.props.history.push(`/temple#${id}`)
    }

    render() {
        const templeData = this.props.templeData
        // const separator = (sectionID, rowID) => (
        //     <div
        //         key={`${sectionID}-${rowID}`}
        //         style={{
        //         backgroundColor: '#F5F5F9',
        //         height: 8,
        //         borderTop: '1px solid #ECECED',
        //         borderBottom: '1px solid #ECECED',
        //         }}
        //     />
        // );
        let index = templeData.length - 1,i=0;
        const row = (rowData, sectionID, rowID) => {
            if (i > index) {
                i = 0
            }
            const obj = templeData[i++];
            return obj?(
                <div key={rowID} style={{ padding: '0 15px',borderBottom: '10px solid #efeff4' }} onClick={()=>this.handleClick(obj.id)}>
                    <div style={{  display: 'flex', padding: '15px 0' }}>
                        <img style={{ height: '120px', marginRight: '15px' }} src={obj.img} alt="" />
                        <div style={{ lineHeight: 1 }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.name}</div>
                            <div className="text-overflow6">{obj.tag}</div>
                            <div><span>{obj.sect}</span><span style={{ marginLeft: 20 }}>{obj.province}</span></div>
                        </div>
                    </div>
                </div>
            ): ''
        }
        return (
            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center', display : `${this.props.templeData.length===0?'block':'none'}` }}>
                                        没有了
                                    </div>)}
                renderRow={row}
                // renderSeparator={separator}
                className="am-list"
                pageSize={4}
                useBodyScroll
                scrollRenderAheadDistance={500}
                pullToRefresh={<PullToRefresh
                    direction={'up'}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />}
                // onEndReached={this.onEndReached}
                // onEndReachedThreshold={10}
            />
        );
    }

}

export default Listview;

