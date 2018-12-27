import React from 'react'
import {withRouter} from 'react-router-dom'      
import {connect} from 'react-redux'

import {loadData} from '../../redux/user.redux'
import { getQueryString,  getStorage, setStorage } from '../../util'
import User from '../../service/user-service.jsx'

const _user = new User()
const isMoblieMode = false

@withRouter 
@connect(
    null,
    {loadData}
)
class AuthRoute extends React.Component{
    componentWillMount(){
        // this.getLogin()
    }
    storageSave(data){
        const userinfo = {id:data.id, openid:data.openid, nick:data.nick, headImgURL:data.headImgURL}
        setStorage('user', userinfo )
        this.reduxSave(userinfo)
    }
    reduxSave(userinfo){
        this.props.loadData(userinfo)       //为了在个人中心页中，从微信取了用户信息能够及时显示，所以只能用redux
    }

    async getLogin(){
        const code = getQueryString("code")
        const user = getStorage('user')
        console.log(1)
        if(code){
            let res = await _user.getUserLogin(isMoblieMode,code)
            if(res.status===200){
                console.log(2)
                this.storageSave(res.data)
            }
        }else if(user === ''|| !user.openid){
            if(isMoblieMode){
                let appid = 'wx9ce81988a89adfc4',
                    RedicetURI = window.location.href,
                    uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${RedicetURI}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
                window.location.href = uri;
            }else{
                let res = await _user.getUserLogin(isMoblieMode)
                console.log(3,res)
                if(res.status===200){
                    this.storageSave(res.data)
                    if (this.userInfoReadyCallback) {
                        console.log('callback')
                        this.userInfoReadyCallback(this.data)
                    }
                }
            }
        }else{
            console.log(4)
            this.reduxSave(user)
        }
    }

    render(){
        return (
            <div>
            </div>
        )
    }
}

export default AuthRoute;