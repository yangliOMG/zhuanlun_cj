/*
 * @Author: yangli 
 * @Date: 2018-05-21 11:17:09 
 * @Last Modified by: yangli
 * @Last Modified time: 2018-10-31 14:51:15
 */
import { Toast } from 'antd-mobile';
/**
 * 获取url参数
 * @param {参数key} name 
 */
export function getQueryString(name){
    if(typeof window === "undefined"){
        return true
    }
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 比较页面父子关系
 * @param {历史页} lastPath 
 * @param {当前页} page 
 */
export function comparePath(lastPath,page){
    let relationship = 'father'
    if(page.father && page.father.length>0){
        relationship = page.father.includes(lastPath)? 'father' : relationship
    }
    if(page.son && page.son.length>0){
        relationship = page.son.includes(lastPath) ? 'son' : relationship
    }
    return relationship
}
/**
 * 存缓存
 * @param {key} name 
 * @param {value} data 
 */
export function setStorage(name,data){
    if(typeof window === "undefined"){
        return true
    }
    let dataType = typeof data;
    if(typeof data === 'object'){
        window.localStorage.setItem(name,JSON.stringify(data));
    }else if(['number','string','boolean'].includes(dataType)){
        window.localStorage.setItem(name,data);
    }else{
        alert('不能存')
    }
}
/**
 * 取缓存
 * @param {key} name 
 */
export function getStorage(name){
    if(typeof window === "undefined"){
        return true
    }
    let data = window.localStorage.getItem(name);
    let dataType = typeof data;
    if(['number','string','boolean'].includes(dataType)){
        try {  
            return JSON.parse(data)||""
        } catch(e) {  
            return data||""
        }  
    }else{
        return "";
    }
}
/**
 * 删缓存
 * @param {key} name 
 */
export function removeStorage(name){
    window.localStorage.removeItem(name)
}
/**
 * 弹出框
 * @param {内容} msg 
 */
export function showToast(msg,duration=1) {
    Toast.info(msg, duration);
}
/**
 * 数字转汉字
 * @param {数字} num 
 */
export function numberDictionary(num){
    let dick = ['一','二','三','四','五','六','七','八','九','十',
                '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',]
    return dick[num] || "超出边界"
}
/**
 * 数字转方向
 * @param {数字} num 
 */
export function directionDictionary(num,type=0){
    let dick = [['南','东南','东','东北','北','西北','西','西南'],
                ['S','SE','E','EN','N','WN','W','WS']]
    return dick[type][num] || "超出边界"
}
/**
 * 数字转时间长度
 */
export function duringDictionary(){
    return [{type:1,name:'1天'},{type:7,name:'1周'},{type:30,name:'1月'},{type:365,name:'1年'},{type:7200,name:'长明'}]
}
/**
 * 数字反向表示层数
 * @param {数字} num 
 * @param {数字} len 
 */
export function cengConvert(idx,lenth){
    try {
        return Number(lenth) - Number(idx)
    } catch (error) {
        return 'X'
    }
}
/**
 * 数字反向表示层数
 * @param {面} side 
 * @param {行} row 
 * @param {列} row 
 * @param {最大高度} maxH 
 * @param {模式} mode       mode1 转换模式 :面-1 行-1 列0  ；mode2: 面0 行0 列+1  
 */
export function positionMesArray(side,row,col,maxH,mode){
    if(mode==="mode1"){
        return [`${directionDictionary(side-1)}${cengConvert(row-1,maxH||15)}层第${('0'+col).slice(-2)}位`,
                `${directionDictionary(side-1)}${cengConvert(row-1,maxH||15)}${col}`,
                `${side-1},${row-1},${col-1}`]
    }else
        return [`${directionDictionary(side)}${cengConvert(row,maxH)}层第${('0'+(Number(col)+1)).slice(-2)}位`,
                `${directionDictionary(side)}${cengConvert(row,maxH)}${Number(col)+1}`,
                `${side},${row},${col}`]
}
/**
 * 时间转汉字
 * @param {日期} Date 
 */
export function dateDictionary(date){
    try {
        let year = date.getFullYear(),
            month = date.getMonth()+1,
            day = date.getDate(),
            dayStr = year+'年'+month+'月'+day+'日',
            dd = ''
        dayStr.split('').forEach(d=>{
            switch(d){
                case '0':dd += '零';break
                case '1':dd += '一';break
                case '2':dd += '二';break
                case '3':dd += '三';break
                case '4':dd += '四';break
                case '5':dd += '五';break
                case '6':dd += '六';break
                case '7':dd += '七';break
                case '8':dd += '八';break
                case '9':dd += '九';break
                default:dd += d;break
            }
        })
        return dd
    } catch (error) {
        return ''
    }
    
}
/**
 * 三维数组选出最优的num个位置
 * @param {三维数组} dataArr 
 * @param {数量} num 
 */
export function recommendAI(dataArr,num){
    let bestPos = new Map()
    // let data = []
    dataArr.forEach((arr2d,idx) => {
        arr2d.forEach((arrrow,idx1) => {
            let count = 0 , row = []
            arrrow.forEach((v,idx2) => {
                let val = 0;
                if(v.state===1){
                    count = 0
                }else{
                    val += 10 
                    for (let i = 0; i < count; i++) {
                        // data[data.length-i-1] += 10*count
                        row[row.length-i-1] += 10*count
                    }
                    count ++
                }
                // data.push(val)
                row.push(val)
                bestPos.set(val,[idx,idx1,idx2])
            })
            row.forEach((v,idx2) => {
                bestPos.set(v,[idx,idx1,idx2])
            })
            while(bestPos.size > num){
                let min = Math.min(...bestPos.keys())
                bestPos.delete(min)
            }
        })
    })
    return [...bestPos.values()]
}
/**
 * 时间ios兼容转换
 * @param {日期} date 
 */
export function timeFormat(date){
    try {
        return new Date(date.replace(/(\+\d{2})(\d{2})$/, "$1:$2"))
    } catch (error) {
        return '0'
    }
}
/**
 * 时间ios兼容转换
 * @param {日期} date 
 */
export function continueLamp(date){
    try {
        let cha = new Date(date.replace(/(\+\d{2})(\d{2})$/, "$1:$2")).getTime() - new Date().getTime()
        return cha > 0 ? true:false
    } catch (error) {
        return '0'
    }
}
/**
 * 计算时长
 * @param {起始日期} date 
 * @param {结束日期} date 
 * @param {切换为计算剩余时间} boolean 
 */
export function timeLongCount(begin,end,otherside){
    try {
        let a = new Date(timeFormat(begin)).getTime(),
            b = new Date(timeFormat(end)).getTime(),  
            c = new Date().getTime()
        let date3 = b<c? b-a : c-a
        if(otherside){
            if(b<c){
                return '已过期'
            }else{
                date3 = b-c
            }
        }
        //计算出相差天数
        let days=Math.floor(date3/(24*3600*1000))
        //计算出小时数
        let leave1=date3%(24*3600*1000)//计算天数后剩余的毫秒数
        let hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        let leave2=leave1%(3600*1000)//计算小时数后剩余的毫秒数
        let minutes=Math.floor(leave2/(60*1000))
        //计算相差秒数
        let leave3=leave2%(60*1000)//计算分钟数后剩余的毫秒数
        let seconds=Math.round(leave3/1000)
        let html = days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒"
	    if(days<=0&&hours<=0&&minutes<=0)
	    	html = seconds+"秒";
	    else if(days<=0&&hours<=0)
	    	html = minutes+"分钟"+seconds+"秒";
	    else if(days<=0)
	    	html = hours+"小时"+minutes+"分钟"+seconds+"秒";
        return html
    } catch (error) {
        return '0'
    }
}
/**
 * 数组求和 
 * @param {数组} arr 
 */
export function ArraySum(arr){
	let a = 0
    arr.forEach(el=>a +=Number(el))
	return a
}
