import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware ,compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import App from './app.jsx';
import reducer from './reducer.jsx'
import './reset.css';
import './index.less';



const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension?window.devToolsExtension():f=>f
))

ReactDOM.render(
    (<Provider store={store}>
        <BrowserRouter>
            <App></App>
        </BrowserRouter>
    </Provider>)
    , 
    document.getElementById('root')
);
