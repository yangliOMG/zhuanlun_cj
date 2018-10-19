
const SAVELIST = 'SAVELIST'
const SAVEANCHOR = 'SAVEANCHOR'

const initState = {
    templeList:[],
}
export function praydata(state=initState, action){
    switch(action.type){
        case SAVELIST:
            return {...state ,templeList : action.payload}
        case SAVEANCHOR:
            return {...state ,anchor : action.payload}
        default:
            return state
    }
}


export function saveTempleList(templeList){
    return {type:SAVELIST , payload:templeList}
}

export function saveAnchor(data){
    return {type:SAVEANCHOR , payload:data}
}