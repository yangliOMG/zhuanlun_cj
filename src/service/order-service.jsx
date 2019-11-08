import axios from "./axios"
import qs from 'qs'

class Order{
    createOrder(order){
        return axios.get('/pray/create.do',{params: {
            data:JSON.stringify(order)
        }})
    }
    deleteOrder(id){
        return axios.get('/pray/delete.do',{params: {
            id
        }})
    }
    cancelOrder(id){
        return axios.get('/pray/cancel.do',{params: {
            id
        }})
    }
    getOrderList(){
        return axios.get('/pray/list.do')
    }
    getOrderByid(id){
        return axios.get('/pray/items.do',{params: {
            id
        }})
    }
    getTopMes(fid){
        return axios.get('/pray/top.do',{params: {
            top:5,fid
        }})
    }


    createBlissMan(blissMan){
        // return axios.post('/blissMan/img.do',
        //     blissMan,
        //     { responseType: 'arraybuffer' }
        // )
        return axios({
            method: 'post',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            responseType: 'arraybuffer',
            data: qs.stringify(blissMan),
            url:'/blissMan/img.do',
        });
    }
    

    getWechatPay(res){
        return axios.get('/wxpay/wechat_pay.do',{params: {
            prayId:res.prayId , 
        }})
    }
    getWechatPayCallback(res){
        return axios.get('/wxpay/updatePrayType.do',{params: {
            prayId:res.prayId , 
        }})
    }



    getTemplateList({type,content}){
        return axios.get(`/template/info.do?type=${type}&content=${content}`)
    }
    getRandomTemplateByType(type){
        return axios.get('/template/random.do',{params: {
            type
        }})
    }
    getTextScan(content){
        return axios.get('/template/textScan.do',{params: {
            content
        }})
    }
}

export default Order