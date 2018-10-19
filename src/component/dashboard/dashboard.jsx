import React from 'react'
import {connect} from 'react-redux'
import { Route, Redirect} from 'react-router-dom' 
// import QueueAnim from 'rc-queue-anim';
import { AnimatedSwitch } from 'react-router-transition';

// import Gongde from '../../pray/introduce/gongde.jsx'
// import Haochu from '../../pray/introduce/haochu.jsx'
// import Yuanqi from '../../pray/introduce/yuanqi.jsx'
// import TempleList from '../../pray/templeList/templeList.jsx'
// import PrayForm from '../../pray/prayForm/prayForm.jsx'
// import TempleDetail from '../../pray/templeDetail/templeDetail.jsx'
// import Template from '../../pray/template/template.jsx'
// import LampDetail from '../../pray/lampDetail/lampDetail.jsx'
// import PrayDetail from '../../pray/prayDetail/prayDetail.jsx'


// import Temple from '../../pray/temple/temple.jsx'

// import PersonalCenter from '../../personal/personalCenter/personalCenter.jsx'
// import MyPraylist from '../../personal/myPraylist/myPraylist.jsx'
// import MyCarelist from '../../personal/myCarelist/myCarelist.jsx'
// import MyHistory from '../../personal/myHistory/myHistory.jsx'
// import MyPhone from '../../personal/myPhone/myPhone.jsx'
// import MySuggest from '../../personal/mySuggest/mySuggest.jsx'

import {setStorage, getStorage, comparePath} from '../../util'
import asyncComponent from './AsyncComponent'

const Gongde = asyncComponent(() => import("../../pray/introduce/gongde.jsx"))
const Haochu = asyncComponent(() => import("../../pray/introduce/haochu.jsx"))
const Yuanqi = asyncComponent(() => import("../../pray/introduce/yuanqi.jsx"))
const TempleList = asyncComponent(() => import("../../pray/templeList/templeList.jsx"))
const PrayForm = asyncComponent(() => import("../../pray/prayForm/prayForm.jsx"))
const TempleDetail = asyncComponent(() => import("../../pray/templeDetail/templeDetail.jsx"))
const Template = asyncComponent(() => import("../../pray/template/template.jsx"))
const LampDetail = asyncComponent(() => import("../../pray/lampDetail/lampDetail.jsx"))
const PrayDetail = asyncComponent(() => import("../../pray/prayDetail/prayDetail.jsx"))
const Temple = asyncComponent(() => import("../../pray/temple/temple.jsx"))

const PersonalCenter = asyncComponent(() => import("../../personal/personalCenter/personalCenter.jsx"))
const MyPraylist = asyncComponent(() => import("../../personal/myPraylist/myPraylist.jsx"))
const MyCarelist = asyncComponent(() => import("../../personal/myCarelist/myCarelist.jsx"))
const MyHistory = asyncComponent(() => import("../../personal/myHistory/myHistory.jsx"))
const MyPhone = asyncComponent(() => import("../../personal/myPhone/myPhone.jsx"))
const MySuggest = asyncComponent(() => import("../../personal/mySuggest/mySuggest.jsx"))

@connect(
    state=>state,
)
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title:'',
        }
    }
    componentDidMount(){
        let height = document.documentElement.clientHeight
        document.getElementById('root').style.height = height +'px'
    }
    handleLeftClick(path){
        if(path === '/prayDetail'){
            this.props.history.push("/myPraylist")
        }else if(path === '/myPraylist'){
            this.props.history.push('/personalCenter')
        }else{
            this.props.history.goBack()
        }
    }
    render(){
        const {pathname}  = this.props.location
        const navList = [
            {path:'/gongde',title:'供灯功德',component:Gongde,father:['/shouye'],son:['/temple']},
            {path:'/haochu',title:'供灯意义',component:Haochu,father:['/shouye'],son:['/temple']},
            {path:'/yuanqi',title:'供灯缘起',component:Yuanqi,father:['/shouye'],son:['/temple']},

            {path:'/templeList',title:'寺院列表',component:TempleList,father:['/shouye'],son:['/temple']},
            {path:'/temple',title:'寺院',component:Temple,father:['/templeList','/myCarelist','/myHistory'],son:['/templeDetail','/pay/prayForm']},
            {path:'/templeDetail',title:'寺院详情',component:TempleDetail,father:['/temple'],son:[]},
            // {path:'/tower',title:'祈福塔',component:Tower,father:['/temple','/myCarelist','/myHistory'],son:['/pay/prayForm']},
            {path:'/pay/prayForm',title:'祈福供灯',component:PrayForm,father:['/temple'],son:['/template','/lampDetail']},
            {path:'/template',title:'祈福语',component:Template,father:['/pay/prayForm'],son:[]},
            {path:'/lampDetail',title:'选择灯位',component:LampDetail,father:['/pay/prayForm'],son:[]},

            {path:'/pay/prayDetail',title:'供灯详情',component:PrayDetail,father:['/pay/prayForm','/myPraylist','/personalCenter'],son:[]},

            {path:'/personalCenter',title:'个人中心',component:PersonalCenter,father:[],son:['/myCarelist','/myHistory','/myPraylist','/myPhone','/mySuggest','/pay/prayDetail']},
            {path:'/myPraylist',title:'我的祈福',component:MyPraylist,father:['/personalCenter'],son:['/pay/prayDetail']},
            {path:'/myCarelist',title:'我的收藏',component:MyCarelist,father:['/personalCenter'],son:['/temple','/tower']},
            {path:'/myHistory',title:'我的足迹',component:MyHistory,father:['/personalCenter'],son:['/temple','/tower']},
            {path:'/myPhone',title:'绑定手机号',component:MyPhone,father:['/personalCenter'],son:[]},
            {path:'/mySuggest',title:'意见反馈',component:MySuggest,father:['/personalCenter'],son:[]},

        ]
        const page = navList.find(v=>v.path===pathname)
        if(page){
            let lastPath = getStorage('lastPath')
            let plus = comparePath(lastPath,page) === 'father'? -1:1
            setStorage('lastPath',pathname)
            let height = 500
            if(typeof document !== 'undefined'){
                height = document.documentElement.clientHeight
                document.title = page.title
            }
            return (
                <div>
                    {/* <NavBar id="navbar" icon={<span className="navleft"><Icon type="left" /><span id="pagetitle">{page.title}</span></span>} mode='light' onLeftClick={()=>this.handleLeftClick(page.path)}></NavBar> */}
                    {/* <NavBar id="navbar" icon={<Icon type="left" style={{color:'black'}} />} mode='light' onLeftClick={()=>this.handleLeftClick(page.path)}>{page.title}</NavBar> */}
                    <AnimatedSwitch
                        atEnter={{ opacity: 0, foo: 0 }}
                        atLeave={{ opacity: 0, foo: 2 }}
                        atActive={{ opacity: 1, foo: 1 }}
                        mapStyles={(styles) => {
                            let x = plus * (styles.foo-1)*100
                            let val = x===0? 'none': 'translateX(' + x + '%)'
                            return {
                                position: (styles.foo <= 1) ? 'relative': 'absolute',
                                width: '100%',
                                height: height+'px',
                                opacity: styles.opacity,
                                transform: val
                            }
                        }}
                        >
                        {/* <QueueAnim type={page.type}> */}
                            {/* <Switch>
                                {navList.map(v=> */}
                                    <Route key={page.path} path={page.path} component={page.component}></Route>
                                {/* )}
                            </Switch> */}
                        {/* </QueueAnim> */}
                        </AnimatedSwitch>
                </div>
            )
        }else{
            return <Redirect to='/temple'></Redirect>
        }
    }
}

export default Dashboard;