import React from 'react'
import { Button, WhiteSpace } from 'antd-mobile'

import './gongde.less'

class TempleDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return (
            <div>
                <div className="lineBorder"></div>
                <WhiteSpace />
                <div className='gongdeContent'>
                    <p><span className='c-fuzhu b'>一、手机远程转轮藏佛前供灯祈福</span>
                    <p><span className='dot c-fuzhu'>● </span>供灯两盏：福慧双增 大吉大利</p>
                    <p><span className='dot c-fuzhu'>● </span>供灯四盏：四平八稳 富运吉祥</p>
                    <p><span className='dot c-fuzhu'>● </span>供灯六盏：六六大顺 事事如意  </p>
                    <p><span className='dot c-fuzhu'>● </span>供灯九盏：九九归一 万事吉祥</p>
                    </p>

                    <p><span className='c-fuzhu b'>二、转动祈福明灯的意义：</span></p>
                    <p className='duanluo'>佛经云：“若人求福至其轮藏，一花一香礼拜供养右旋行道，由是功德：官位荣耀不求自至；寿命富饶不祈自增；怨家盗贼不讨自败；怨念咒咀不厌归本；疫疠邪气不拔自避；善夫良妇不求自得；贤男美女不祷自生。一切所愿任意满足！”</p>
                    <p><span className='dot c-fuzhu'>● </span>转三圈：怨念咒咀不厌归本； </p>
                    <p><span className='dot c-fuzhu'>● </span>转六圈：疫疠邪气不拔自避； </p>
                    <p><span className='dot c-fuzhu'>● </span>转九圈：怨家盗贼不讨自败； </p>
                    <p><span className='dot c-fuzhu'>● </span>转十二圈：善夫良妇不求自得； </p>
                    <p><span className='dot c-fuzhu'>● </span>转十五圈：贤男美女不祷自生；</p>
                    <p><span className='dot c-fuzhu'>● </span>转十八圈：寿命富饶不祈自增；</p>
                    <p><span className='dot c-fuzhu'>● </span>转二十一圈：官位荣耀不求自至； </p>
                    <p><span className='dot c-fuzhu'>● </span>转九十九圈：一切所愿任意满足。</p>

                    <p><span className='c-fuzhu b'>三、佛前供灯时间含义：</span></p>
                    <p className='duanluo'>点亮的灯随转轮藏转动。每转动一圈代表为每位点灯祈福者念送转轮藏内经文一遍，祈福一次。</p>

                    <p><span className='dot c-fuzhu'>● </span>点灯一天：代表冤家盗贼不伐自败，不=受小人坑害、强盗打击和小偷损财；</p>
                    <p><span className='dot c-fuzhu'>● </span>点灯一月：代表官位荣耀不求自得，官位和社会名利不求自得；</p>
                    <p><span className='dot c-fuzhu'>● </span>点灯一年：代表俊男美女不祷自生，子孙后代贤良淑慧、衣禄无忧、光耀门厅；</p>
                    <p><span className='dot c-fuzhu'>● </span>点灯三年：一切心愿任意满足，所有心愿都能满足，子孙无忧。（注：三年代表长明）</p>
                </div>
                
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <Button type="warning" className="fixedButton"
                    onClick={()=>this.props.history.push('/temple')}
                    >我要祈福</Button>
                
            </div>
        )
    }
}

export default TempleDetail;