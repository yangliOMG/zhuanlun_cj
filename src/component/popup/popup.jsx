import React from 'react'

// import {Redirect} from 'react-router-dom'

// import {update} from '../../redux/user.redux'
import './popup.css'

class Popup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return (
            <div>
                <div style={{display: 'none',position: 'fixed',top:'0',bottom:'0',left:'0',right:'0',background:'#fff',zIndex:'1000' }} >
                    {this.props.children}
                </div>
                <div style={{display: 'none',position: 'fixed',top:'0',bottom:'0',left:'0',right:'0',background:'black',zIndex:'999' }} >
                </div>
            </div>
        )
    }
}

export default Popup;