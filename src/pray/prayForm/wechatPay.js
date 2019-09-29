import { Toast} from 'antd-mobile'
import Order from '../../service/order-service.jsx'
import {showToast } from '../../util'
const _order = new Order()

export function webchatPay(res){
    Toast.loading('加载中...',0)
    _order.getWechatPay(res).then(res=>{

        // 2019-9-29 直接跳转不支付
        if(res.data && res.data.prayId){
            return window.location.href = '/pay/prayDetail#'+res.data.prayId

        }else{
            return window.location.href = '/personalCenter'
        }

        if (typeof(WeixinJSBridge) === "undefined"){  
            if( document.addEventListener ){  
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady.bind(res.data), false);  
            }else if (document.attachEvent){  
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady.bind(res.data));  
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady.bind(res.data));  
            }  
        }else{  
            onBridgeReady.call(res.data);  
        }
        Toast.hide()
    }).catch(error=>{
        showToast(error.message)})
}
    
function onBridgeReady(){
    if(typeof window.WeixinJSBridge === "undefined"){
        return alert("WeixinJSBridge未定义")
    }
    const prayid = this.prayId
    window.WeixinJSBridge.invoke(  
        'getBrandWCPayRequest', {  
            "appId" : this.appid,     //公众号名称，由商户传入   
            "timeStamp" : this.timestamp, //时间戳，自1970年以来的秒数 (java需要处理成10位才行，又一坑)  
            "nonceStr" : this.nonceStr, //随机串  
            "package" : this.packageValue, //拼装好的预支付标示  
            "signType" : "MD5",//微信签名方式  
            "paySign" : this.paySign //微信签名  
        },  
        function(res){
            if(res.err_msg === "get_brand_wcpay_request:cancel" ) {
                // _order.cancelOrder(prayid).then(res=>{
                //     if(res.status === 200 ){
                        showToast('取消支付')
                //     }
                // })
            }else{
                setTimeout(() => {
                    const reload = window.location.href.includes('prayDetail')
                    if(reload){
                        window.location.reload()
                    }else{
                        window.location.href = '/pay/prayDetail#'+prayid
                    }
                }, 500)
            }
        }  
    ) 
} 
