import React from 'react'
import { WingBlank, WhiteSpace,  List, Button, Toast } from 'antd-mobile'
import {connect} from 'react-redux'

import {showToast } from '../../util'

import User from '../../service/user-service.jsx'
import  "./myPhone.less"

const _user = new User()
@connect(
    state=>state.user,
)
class MyPhone extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            flag:false,
            phone:'',
            inputphone:'',
            vercode:'',
            disabled:false,
            btnContent:'获取验证码'
        }
    }

    componentWillMount(){
        _user.getUserMes().then(res=>{
            if(res.status === 200 && res.data.tel){
                this.setState({
                    phone: res.data.tel,
                    flag:true
                })
            }
        })
    }

    handleGetvercode(){
        if( this.state.disabled )
            return true;
        let phone = this.state.inputphone
        let preg = /^(((13[0-9]{1})|(15[0-35-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //匹配手机号
        if( phone==='' || !preg.test(phone)){
            showToast('请输入正确格式的电话号码')
            return false
        }else{
            let times=60, T = null
            T=setInterval(()=>{
                times--;
                if(times<=0){
                    this.setState({
                        disabled:false,
                        btnContent:'获取验证码'
                    })
                    clearInterval(T)
                }else{
                    this.setState({
                        disabled:true,
                        btnContent: times+'秒后重试'
                    })
                }
            },1000)

            _user.sendVerCode(phone).then(res=>{
                let status = res.data[0]
                if(status==='1'){
                    showToast('短信验证码已成功发送！',2)
                }else if(status==='-1'){
                    showToast('短信验证码请求间隔为60s！',2)
                }else{
                    showToast('短信验证码发送失败！！',2)
                    this.setState({
                        disabled:false,
                        btnContent: '获取验证码'
                    })
                }
            })
        }
    }
    handleChange(event,key){
        this.setState({[key]: event.target.value})
    }
    handleBindnum(){
        this.setState({flag: false})
    }

    handleSubmitPhone(){
        Toast.loading('加载中...',0)
        _user.submitPhone({tel:this.state.inputphone,code:this.state.vercode}).then(res=>{
            if(res.data){
                showToast('绑定成功！')
                setTimeout(()=>this.props.history.goBack(), 1000)
            }else{
                showToast('验证码有误！',2)
            }
        })
    }

    render(){
        return (
            <div>
                <WhiteSpace/>
                <WingBlank size="lg">

                    <List className={`radius phonePannel ${!this.state.flag&&'hidden'}`}>
                        <div className='pt-30'>绑定的手机号：{this.state.phone}</div>
                        <div className='pd-30'>
                            <div className='changebtn' onClick={()=>this.handleBindnum()}>更换手机号</div>
                        </div>
                    </List>
                    <div className={`${this.state.flag&&'hidden'}`}>
                        <List className='radius phonePannel'>
                            <div className='bordbot'>
                                <input type="text" className="inputBot" placeholder="输入您的手机号" 
                                    onChange={(event)=>this.handleChange(event,'inputphone')} value={this.state.inputphone}  />
                            </div>
                            <table>
                                <tbody>
                                <tr>
                                    <td><input type="text" className="inputBot" placeholder="验证码"
                                        onChange={(event)=>this.handleChange(event,'vercode')} value={this.state.vercode} /></td>
                                    <td width="92"><a className={`codebtn ${this.state.disabled&&'disabled'}`} onClick={()=>this.handleGetvercode()} >{this.state.btnContent}</a></td>
                                </tr>
                                </tbody>
                            </table>
                        </List>
                        <WhiteSpace/>
                        <Button type="warning" className="orangeBtn"
                            onClick={()=>this.handleSubmitPhone()}
                            >确认</Button>
                    </div>
                </WingBlank>
            </div>
        )
    }
}

export default MyPhone;