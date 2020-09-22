import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
    Image,
    Button,
    OverlayTrigger,
    Popover,
    Overlay,
    InputGroup,
    Form,
    FormControl
} from 'react-bootstrap';
import { Menu, MenuItem, Fade } from '@material-ui/core';
import * as actions from './actions.js';
import { fetchJson, sendJson, loadPage } from './backend.js';
//import { useLogin } from './userLogin.js';

/*
 * Wraps the user icon button and acts as starting point for the different login states, e.g. show the user menu when
 * already logged in or, offer a login screen when the user is yet unknown.
 */
export function UserMenuCtl(props) {

    const userState = useSelector(state => state.userState);

    const [anchorEl, setAnchorEl] = useState(null); // essentially the user icon, wrapped by button = anchor

    const openMenu = (event) => {

        setAnchorEl(event.target);
    };

    const hideMenu = (args) => {

        setAnchorEl(null);
    };

    const chooseMenu = (anchorElement) => {

        if(Boolean(userState.user)) {

            return (

                <UserMenu
                    closeCallback={ hideMenu }
                    anchor={ anchorElement }
                    user={ userState.user } />
            );
        }

        else {

            return  (

                <LoginPopover
                    closeCallback={ hideMenu }
                    anchor={ anchorElement }
                />
            );
        }
    };

    return (

        <div>

            <Button
                aria-controls="user-menu"
                aria-haspopup="true"
                variant="link"
                onClick={ openMenu }
            >
                <UserIcon />

            </Button>

            { Boolean(anchorEl) ? chooseMenu(anchorEl) : null }

        </div>
    );
}

/* The React UserIcon component (hooks API). */
function UserIcon(props) {

    const userState = useSelector(state => state.userState);

    return (

        Boolean(userState.user) ?

            <Image id="user_logo_img" src="/assets/images/runner-color.svg"></Image>

        :

            <Image id="user_logo_img" src="/assets/images/runner-faded.svg"></Image>
    )
}

function LoginPopover(props) {

    const [nickName, setNickName] = useState('');

    const [passWord, setPassWord] = useState('');

    const [trialsCounter, setTrialsCounter] = useState(0);

    const dispatch = useDispatch();

    const loadUserData = async () => {

        try {

            // Use GET asynchronously
            let userData = await fetchJson("/user", {'nickName': nickName, 'passWord': passWord});

            if (userData['invalid']) {

                let errMsg = 'Message: ' + messages['login.error.username'];

                dispatch(actions.logError(errMsg));
            }
            else {

                dispatch(actions.registerUser(userData));

                // TODO show home page

                props.closeCallback();
            }
        }

        catch(err){

            dispatch(actions.logError(err));
        }
     };

    useEffect(

        () => { loadUserData() },

        [trialsCounter]
     );

    function handleCancel(event) {

        props.closeCallback();
    }

    function handleSubmit(event) {

        event.preventDefault();

        let form = event.currentTarget;

        setNickName(form.elements['nick_name'].value);

        setPassWord(form.elements['pass_word'].value);

        setTrialsCounter(trialsCounter + 1);

        // Popover closed when login successful, see 'loadUserData'
    }

    return (

        <Overlay
            target={ props.anchor }
            show={ true }
            placement="left"
            rootClose={ true }
            rootCloseEvent='click'
            onHide={ handleCancel } >

            {(props) => (

                <Popover
                    id="not_logged_in"
                    {...props}
                >

                    <Popover.Title as="h3">{ messages['not.logged-in.title'] }</Popover.Title>

                    <Popover.Content>

                      { messages['not.logged-in.text'] }

                        <Form onSubmit={ handleSubmit }>

                            <Form.Group controlId="nick_name" className="mb-3">

                                <Form.Label>Nickname</Form.Label>

                                <Form.Control type="text" placeholder="Nickname" id="nick_name"></Form.Control>

                            </Form.Group>

                            <Form.Group controlId="pass_word">

                                <Form.Label>Password</Form.Label>

                                <Form.Control type="password" placeholder="Password" />

                            </Form.Group>

                            <Button type="submit" className="mr-1">

                                Login

                            </Button>

                            <Button className="mr-1" onClick={ handleCancel }>

                                Cancel

                            </Button>

                            <p>Not registered? Register <Link to={{
                                pathname: "/do",
                                search: "?action=register",
                                hash: "#goto-anchor"
                                }} onClick={ handleCancel }>

                                here

                                </Link>.
                            </p>

                        </Form>

                    </Popover.Content>

                </Popover>

            )}
        </Overlay>
    );
}

/* The user menu is shown when the user is logged-in. The 'user' object is available via props.user (read-only); */
function UserMenu(props) {

    const closeMenu = (event) => {

        props.closeCallback();
    };

    return (

         <Menu
             anchorEl={ props.anchor }
             open={ true } // controlled by UserMenuCtl
             //onClose={  console.log('Closing UserMenu..') }
             //onEntering={ console.log('Entering UserMenu, device style = TABLET') }
             TransitionComponent={ Fade }
         >
             <MenuItem onClick={ () => closeMenu() }>

                <Link to={{
                      pathname: "/content",
                      search: "?name=home_page",
                      hash: "#goto-anchor",
                      state: { fromDashboard: true }
                    }}>

                    Home

                </Link>

             </MenuItem>

             <MenuItem onClick={ () => closeMenu() }>

                 <Link to={{
                       pathname: "/content",
                       search: "?name=user_settings",
                       hash: "#the-hash",
                       state: { fromDashboard: true }
                     }}>

                     Settings

                 </Link>

             </MenuItem>

             <MenuItem onClick={ () => closeMenu() }>

                 <Link to={{
                       pathname: "/do",
                       search: "?action=logout",
                       hash: "#the-hash",
                       state: { fromDashboard: true }
                     }}>
                     Logout
                 </Link>

             </MenuItem>

         </Menu>
    );
}