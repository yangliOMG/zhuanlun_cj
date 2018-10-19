
const LOAD_DATA = 'LOAD_DATA'

const initState = {
    openid:'',
    nick:'',
    headImgURL:''
}
export function user(state=initState, action){
    switch(action.type){
        case LOAD_DATA:
            return {...state ,...action.payload}
        default:
            return state
    }
}


export function loadData(userinfo){
    return {type:LOAD_DATA , payload:userinfo}
}