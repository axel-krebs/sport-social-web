import React from 'react';
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {  UserMenuCtl } from './userMenu.js';
import { appReducers } from './globalState.js';
import 'regenerator-runtime';

const userMenuIconEl = document.getElementById("user_menu_icon");

const userMenuDiv = document.getElementById("user_menu_div");

const mainPanel = document.getElementById("main_panel");

const leftPanel = document.getElementById("left_details_panel");

const bottomPanel = document.getElementById("footer_menu");

// create a global application structure to be used from multiple components
const globalCache = createStore( appReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );

console.log('Global Cache: ' + JSON.stringify(globalCache));

// only use menu if not already visible (hidden for small screens)
var menuDisplay = window.getComputedStyle(userMenuDiv).display;

if(menuDisplay == 'none') {

    const mainPanelDiv = document.getElementById("main_panel");

    var userMenu = ReactDOM.render(

        <Provider store={ globalCache }>

            <UserMenuCtl mainPanel={ mainPanelDiv } />

        </Provider>,

        userMenuIconEl

     );
}
else {
    console.log('User menu not rendered because display == "none".');
}

// Left panel only visible if screen width > 820px

// The footer contains Links that can be moved to the left menu, unless it's visible
