import axios from "./axios"


class Temple{

    getTempleListAll(index){
        return axios.get(`/temple/allList.do`,{params: {
            index:1,
            page:5*index
          }})
    }

    getTempleListByTag(tag,index){
        return axios.get(`/temple/tagList.do`,{params: {
            tag,
            index:1,
            page:5*index
          }})
    }

    getTempleListByName(name,index){
        return axios.get(`/temple/nameList.do`,{params: {
            name,
            index:1,
            page:5*index
          }})
    }

    getTempleListByPicker(province,tag,index){
        return axios.get(`/temple/proAndSectList.do`,{params: {
            province,
            tag,
            index:1,
            page:5*index
          }})
    }

    getTempleById(tid,ifset=false){
        return axios.get(`/temple/info.do`,{params: {
            tid,ifset
        }})
    }



    
    getTowerById(id){
        return axios.get(`/facility/info.do`,{params: {
            id
        }})
    }
    getTowerAndPriceById(id){
        return axios.get(`/facility/info1.do`,{params: {
            id
        }})
    }
    getLayoutById(id){
        return axios.get(`/facility/layout.do`,{params: {
            id
        }})
    }
    getOccupyById(id){
        return axios.get(`/facility/occupy.do`,{params: {
            id
        }})
    }
    getRandomPosition(id,num){
        return axios.get(`/facility/random.do`,{params: {
            id,num
        }})
    }

    
    getHistoryListByType(type){
        return axios.get(`/history/my.do`,{params: {
            type
        }})
    }
    getHistoryByType(type){
        return axios.get(`/history/recent.do`,{params: {
            type
        }})
    }
}

export default Temple