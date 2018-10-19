import axios from "./axios"
import qs from 'qs'

class User{

    getSessionlogin(isMoblieMode,code){
        return new Promise(function(resolve,reject){
              const client = new XMLHttpRequest()
              client.open("GET", `/login/login.do?isMoblieMode=${isMoblieMode}&code=${code}`,false)
              client.onreadystatechange = function() {
                if (this.status === 200) {
                    try {
                        let res = JSON.parse(this.response)
                        let userinfo={data :{id:res.id, openid:res.openid, nick:res.nick, headImgURL:res.headImgURL}}
                        resolve(userinfo)
                    } catch (error) {
                        console.log('login',error)
                    }
                } else {
                    reject(new Error(this.statusText))
                }
              }
              client.send()
        })
    }
    getUserLogin(isMoblieMode,code){
        return axios.get(`/login/login.do`,{params: {
            isMoblieMode,code
          }})
    }
    getUserMes(){
        return axios.get(`/login/info.do`,{params: {
            openid: '',
        }})
    }


    judgeIsFollow(){
        return axios.get(`/login/judgeIsFollow.do`,{params: {
        }})
    }
    sendVerCode(tel){
        return axios.get(`/sendMes/sendVerCode.do`,{params: {
            tel,
        }})
    }
    submitPhone(obj){
        return axios.get(`/login/bindingTel.do`,{params: {
            ...obj,
        }})
    }

    submitSuggest(content){
        // return axios.post(`/back/save.do`,{
        //     content,
        // })

        return axios({
            method: 'post',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({content}),
            url:'/back/save.do',
        })
    }

}

export default User