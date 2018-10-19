
const SAVEPRAYLIST = 'SAVEPRAYLIST'

const initState = {
    prayList:[],
}
export function prayList(state=initState, action){
    switch(action.type){
        case SAVEPRAYLIST:
            return {...state ,prayList : action.payload}
        default:
            return state
    }
}


export function savePrayList(prayList){
    return {type:SAVEPRAYLIST , payload:prayList}
}