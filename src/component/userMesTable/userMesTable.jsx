import React from 'react'
import { Modal } from 'antd-mobile'

import './userMesTable.less'

// function closest(el, selector) {
//     const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
//     while (el) {
//       if (matchesSelector.call(el, selector)) {
//         return el;
//       }
//       el = el.parentElement;
//     }
//     return null;
// }

class UserMesTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        // if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
        //     return;
        // }
        // const pNode = closest(e.target, '.am-modal-content');
        // if (!pNode) {
        //     e.preventDefault();
        // }
    }

    render(){
        return (
            <Modal
                visible={this.props.messageModal}
                transparent platform='android'
                onClose={()=>this.props.shutdown()}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                <div>
                    {this.props.children}
                </div>
            </Modal>
        )
    }
}

export default UserMesTable;