import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch, useLocation } from "react-router-dom";
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { appReducers } from './globalState.js';
import { tabletStyle, mobileStyle } from './sposoStyles.js';
import { UserMenuCtl } from './userMenu.js';
import { RegistrationDialog } from './registrationDialog.js'
import { NavCtl } from './navigation.js';
import { loadPage } from './backend.js';
import * as actions from './actions.js';
import { Alert } from 'react-bootstrap';
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

                        <Action />

                    </Route>

                </Switch>

            </Router>

        </Provider>
    );

    /* The function is using the React 'dangerouslySetInnerHTML' attribute to display text loaded from the server. */
    function Content() {

        const name = useQuery().get("name");

        useEffect(

            () => { loadResource() }
         );

        const loadResource = async () => {

            try {

                // Use GET asynchronously
                const pageData = await loadPage(name, {});

                if (pageData['invalid']) { // not a result stream, but error object

                    ReactDOM.render(<div>{ pageData['invalid'] }</div>, mainPanelDiv);
                }
                else {

                    ReactDOM.render(<div dangerouslySetInnerHTML={{__html: pageData }} />, mainPanelDiv);
                }
            }
            catch(err){

                ReactDOM.render( <div>{ err.message }</div>, mainPanelDiv);
            }
        }

        // using a little trick here - due to multiple DOM nodes.. not so nice!
        return (<div></div>);
    };

    function Action () {

        const dispatch = useDispatch();

        const action = useQuery().get("action");

        switch(action) {
            case "register":

                // TODO do some loading before
                ReactDOM.render(<RegistrationDialog size="md" />, mainPanelDiv);
                return <div></div>;

            case "logout":
                dispatch( actions.logoutUser() );
                ReactDOM.render(<div>You are successfully logged out.</div>, mainPanelDiv);
                return <div></div>;

            default:
                console.log('Action not implemented: '+ action);
                return <div></div>;
        }
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
