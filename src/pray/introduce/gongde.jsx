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
                    <p><span className='c-fuzhu b'>一、照世如灯。</span>供灯者生生世世如同世间的明灯，转生为人也是人中之王，就像上师如意宝一样，慧灯照亮整个世界。</p> 

                    <p><span className='c-fuzhu b'>二、肉眼不坏。</span>供灯者肉眼非常明亮，不会变成盲人，也不会成近视眼。</p> 

                    <p><span className='c-fuzhu b'>三、得于天眼。</span>供灯者将来会获得五眼中的天眼。</p> 

                    <p><span className='c-fuzhu b'>四、善恶智能。</span>能辨别善法和恶法，懂得一切因果取舍。现在世间上许多人极为盲目，不知善恶取舍，而供灯者的智慧超越其他人。</p> 

                    <p><span className='c-fuzhu b'>五、灭除大暗。</span>具有超胜的智慧，能灭除自他相续中的一切愚痴黑暗。</p> 

                    <p><span className='c-fuzhu b'>六、得智能明。</span>自己的智慧超群众人，不受外界的各种诱惑，有辨别取舍的能力。</p> 

                    <p><span className='c-fuzhu b'>七、不在暗处。</span>生生世世不会转生在邪见或者黑暗的地方，住于光明的殊胜之地。</p> 

                    <p><span className='c-fuzhu b'>八、具大福报。</span>转生为具有大福报的众生。</p> 

                    <p><span className='c-fuzhu b'>九、命终生天。</span>命终后不会堕入恶趣，而会转生天界。而供灯的话，生生世世不会转生到这种家庭中。</p> 

                    <p><span className='c-fuzhu b'>十、速证涅盘。</span>很快的时间中能证得圣者的果位。《佛说施灯功德经》中说：“彼施灯者所得福聚无量无边，不可算数，唯有如来乃能了知。”人死了以后，务必要在尸体旁放一盏灯或七盏灯，这样亡者会获得解脱。</p> 
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