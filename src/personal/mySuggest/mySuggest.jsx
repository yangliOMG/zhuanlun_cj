import React from 'react'
import { TextareaItem, WhiteSpace,  List, Button, Toast, WingBlank } from 'antd-mobile'
import {connect} from 'react-redux'

import {showToast } from '../../util'

import User from '../../service/user-service.jsx'
import  "./mySuggest.less"

const _user = new User()
@connect(
    state=>state.user,
)
class MyPhone extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:'',
        }
    }

    handleSubmitSuggest(){
        if(this.state.value){
            Toast.loading('加载中...',0)
            _user.submitSuggest(this.state.value).then(res=>{
                if(res.status===200){
                    showToast('提交成功！')
                    setTimeout(()=>{
                        this.props.history.goBack()
                        Toast.hide()
                    }, 500)
                }else{
                    showToast(res.result)
                }
                
            })
        }
    }
    handleChange(value){
        this.setState({value})
    }

    render(){
        return (
            <div>
                <WhiteSpace/>
                <WingBlank size="lg">
                    <List className='suggestArea'>
                        <TextareaItem
                            placeholder='您留下的每一个文字都将有助于我们改善产品，非常期待您的意见反馈！'
                            rows={5}
                            count={100}
                            onChange={(val)=>this.handleChange(val)}
                        />
                    </List>
                    <WhiteSpace/>
                    <Button type="warning" className="orangeBtn"
                        onClick={()=>this.handleSubmitSuggest()}
                        >确认</Button>
                </WingBlank>
            </div>
        )
    }
}

export default MyPhone;