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
                        <p className='c-fuzhu b'>福佑灯塔由转轮藏衍变而来。</p>
                        <p className='duanluo'>转轮藏,是一种源于传统佛教建筑形式的法器,是汉传佛教历史发展中重要的代表文物之一。
                    其设施本身既具有古典建筑的美感,又包含了设计建造者对佛教教理、教义的领悟,是佛教文化物化的表现形式。
                    转轮藏首创于江浙一带，故当初以南方寺院特为盛行，尔后乃推及至北方地区，并逐渐被藏传佛教吸纳且演变为藏族地区家喻户晓的转经筒。</p>
                </div>
                <img width='100%' src={require('./yuanqi.jpg')} alt=""/>
                <div className='gongdeContent'>
                        <p className='duanluo'>佛教“转藏”制度始创于南朝梁代的傅大士(497～569),他姓傅名翕,字立风,又称善慧大士、双林大士,与达摩、志公共称梁代三大士。
                    所谓的“转藏”,就是转读大藏经之意。在《神僧传》卷四中记载：“初大士在日，常以经目繁多，人或不能遍阅，乃就山中建大层龛，一柱八面，
                    实以诸经运行不碍，谓之轮藏。从劝世人有发于菩提心者，能推轮藏，是人即与持诵诸经功德无异。今天下所建轮藏皆设大士像，实始于此。” </p>
                        <p className='duanluo'>这就是转轮藏最初的原型。傅大士所创的转轮藏法门对佛教界的影响很大,至今少许寺院尚存有转轮藏的设施。自古，为轮藏设立的专殿，俗称为“藏殿”。
                    或作塔式建筑，如现今北京西郊颐和园内万寿山之前，有为帝后礼佛诵经之处，正殿为两层楼阁，两侧各有双层八角形配亭。亭内有木塔贯穿楼阁，储存经书佛像。
                    塔中有轴，地下设有机关，可以转动。当今汉传佛教寺院内大多设有藏经阁，其建筑形式也是从转轮藏逐渐演变而来。</p>
                        <p className='c-fuzhu b'>福佑灯塔的诞生</p>
                        <p className='duanluo'>为恢复建设转轮藏并在寺院中大力推广，浙江法缘在佛教如理如法的基础上，研制结合了集藏经阁、佛龛、祈福供灯、电力自动旋转、手动旋转、LED旋转屏幕和远程无线控制于一体的现代转轮藏——福佑灯塔。
                    该设备同时具有自动散热、防雨、防潮、防雷、防漏电等功能。并对包括外观、功能实用性和远程物联网应用在内进行专利申请。</p>
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