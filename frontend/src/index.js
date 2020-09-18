import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch, useLocation } from "react-router-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { appReducers } from './globalState.js';
import { tabletStyle, mobileStyle } from './sposoStyles.js';
import { UserMenuCtl } from './userMenu.js';
import { NavCtl } from './navigation.js';
import * as BS from 'react-bootstrap';
import 'regenerator-runtime';

/* create a global application structure to be used from multiple components */
const globalCache = createStore( appReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

 /* Main entry point for tablet-style app, needs references to DOM elements for anchors. */
export function decorate(userMenuIconDiv, leftPanelDiv, mainPanelDiv, userMenuDiv, bottomPanelDiv) {

    const userMenu = (
        <Provider store={ globalCache }>
            <Router>
                <UserMenuCtl style={ tabletStyle } />
                <Switch>
                    <Route path="/content" >
                        <Content />
                    </Route>
                    <Route path="/do">
                        <Action action='test' />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );

    function Content () {

        let query = useQuery();

        // using a little trick here - due to multiple DOM nodes.. not so nice!
        ReactDOM.render( <div>CONTENT! { query.get("name") }</div>, mainPanelDiv);
        return (<div></div>);
    };

    function Action ({action}) {

        let query = useQuery();

        return (
            <BS.Alert dismissible="true" closeLabel="Close">
                <BS.Alert.Heading>Action: { query.get("action") }</BS.Alert.Heading>
            </BS.Alert>
        );
    }

    const leftPanel = (
        <div>Dynamic</div>
    );

    const bottomNav = (
        <Provider store={ globalCache }>
            <NavCtl />
        </Provider>
    );

    ReactDOM.render( userMenu, userMenuIconDiv);
    ReactDOM.render( leftPanel, leftPanelDiv);
    ReactDOM.render( bottomNav, bottomPanelDiv);
}
