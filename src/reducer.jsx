/*
 * @Author: yangli 
 * @Date: 2018-05-09 15:07:42 
 * @Last Modified by: yangli
 * @Last Modified time: 2018-07-04 14:05:31
 */
import {combineReducers} from 'redux'
import {user} from './redux/user.redux.jsx'
import {order} from './redux/order.redux.jsx'
import {praydata} from './redux/temple.redux.jsx'
import {prayList} from './redux/pray.redux.jsx'


export default combineReducers({user,order,praydata,prayList})