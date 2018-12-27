import React from 'react'
import {connect} from 'react-redux'
import { getQueryString,  getStorage, setStorage } from '../../util'
import User from '../../service/user-service.jsx'
import {loadData} from '../../redux/user.redux'
import "./shouye.css"


const _user = new User()
const isMoblieMode = true

@connect(
    state=>state.user,
    {loadData}
)
class Shouye extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    componentWillMount(){
        const code = getQueryString("code")
        const type = getQueryString("type")||'temple'
        const user = getStorage('user')
        if(code){
            _user.getUserLogin(isMoblieMode,code).then(res=>this.storageSave(res.data,type))
        }else if(user === ''|| !user.openid){
            if(isMoblieMode){
                let appid = 'wx0844c3919de8209c',
                    RedicetURI = window.location.href,
                    uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${RedicetURI}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
                window.location.href = uri;
            }else{
                _user.getUserLogin(isMoblieMode).then(res=>this.storageSave(res.data,type))
            }
        }else{
            this.reduxSaveAndPush(user,type)
        }
    }
    storageSave(data,type){
        const userinfo = {id:data.id, openid:data.openid, nick:data.nick, headImgURL:data.headImgURL}
        setStorage('user', userinfo )
        this.reduxSaveAndPush(userinfo,type)
    }
    reduxSaveAndPush(userinfo,type){
        this.props.loadData(userinfo)       //为了在个人中心页中，从微信取了用户信息能够及时显示，所以只能用redux
        window.location.href = `/${type.replace(':','#')}`
    }

    render(){
        return (
            <div>
                <div className='center'>
                    加载用户信息。。
                </div>
            </div>
        )
    }
}

export default Shouye;