import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link as RLink, Switch } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Button, Menu, MenuItem, Fade, Popover, Link, Dialog, DialogTitle, DialogContent, DialogActions, Input, InputLabel, Drawer, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { InboxIcon, EmailIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import * as actions from './actions.js';
import { fetchJson, sendJson, loadPage } from './backend.js';
//import { useLogin } from './userLogin.js';

/*
 * Wraps the user icon button and acts as starting point for the different login states, e.g. show the user menu when
 * already logged in or, offer a login screen when the user is yet unknown.
 */
export function UserMenuCtl(props) {

    const userState = useSelector(state => state.userState);

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = (event) => {

        /* use the Button as anchor element for the menu */
        setAnchorEl(event.target);
    };

    const hideMenu = (args) => {

        console.log('Setting anchor to NULL');

        setAnchorEl(null);
    };

    /* Depending on whether user is logged-in, display user menu or log-in notification */
    const chooseMenu = () => {

        if(Boolean(userState.user)) {

            return (
                <UserMenu
                    closeCallback={ hideMenu }
                    anchor={ anchorEl }
                    user={ userState.user } />
            );
        }
        else {

            return <NotLoggedMenu closeCallback={ hideMenu } anchor={ anchorEl } />;
        }
    }

    return (

        <div>

            <Button
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={ openMenu }
                startIcon={ <UserIcon /> }
            >
            </Button>

            {
                Boolean(anchorEl) ? chooseMenu() : console.log('UserMenuCtl->chooseMenu: anchor was NULL.')
            }

        </div>
    );
}

/* The React Icon element that replaces the SVG file used in the template. */
function UserIcon(props) {

    const userState = useSelector(state => state.userState);

    return (

        Boolean(userState) ?

            <img className="user-logo" src="/assets/images/runner-color.svg"></img>

        :

            <img className="user-logo" src="/assets/images/runner-faded.svg"></img>
    );
}

/* Show a pseudo-menu when user is not logged-in; offer login button. */
function NotLoggedMenu(props) {

    const [open, setOpen] = useState(true);

    const [showDialog, setShowDialog] = useState(false);

    const handleClose = (event) => {

        setShowDialog(false);

        props.closeCallback();
    }

    const openLoginDialog = (event) => {

        setShowDialog(true);
    }

    return (
        showDialog ?
            <LoginDialog closeCallback={ handleClose }  />
        :
            <Popover
                anchorEl={ props.anchor }
                open={ open }
                onClose={ handleClose }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >

                <p>Not logged in. </p>

                <Link
                  component="button"
                  variant="body2"
                  onClick={ openLoginDialog }
                >
                  Login

                </Link>

            </Popover>
    );
}

/* Show a dialog where user can enter credentials */
function LoginDialog(props){

    const userState = useSelector(state => state.userState);

    const [open, setOpen] = useState(true);

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

                closeDialog();
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

    const closeDialog = () => {

        setOpen(false);

        props.closeCallback();
    };

    return (

        <Dialog open={ open } onClose={ closeDialog } aria-labelledby="simple-dialog-title">

            <DialogTitle id="simple-dialog-title">Please provide login credentials.</DialogTitle>

            <DialogContent>

                <InputLabel id="nick_name">Nickname</InputLabel>

                <Input
                    aria-labelledby="nick_name"
                    value={ nickName }
                    onChange={ (e) => setNickName(e.target.value) }>

                </Input>

                <InputLabel id="pass_word">Password</InputLabel>

                <Input
                    type="password"
                    aria-labelledby="pass_word"
                    value={ passWord }
                    onChange={(e) => setPassWord(e.target.value)}>

                </Input>

            </DialogContent>

            <DialogActions>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={ () => closeDialog() }
                >

                    { messages['cancel'] }

                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<LoginIcon></LoginIcon>}
                    onClick={ () => setTrialsCounter (trialsCounter + 1) }
                >

                    Login

                </Button>

            </DialogActions>

        </Dialog>
    );
}

/* The icon shown in the login dialog to execute login. */
function LoginIcon() {

    return (
        <Icon></Icon>
    );
}

/* The user menu is shown when the user is already logged-in. A 'user' object is available via props.user (read-only);
 * display size can be investigated via 'device' property in UserMenuCtl (parent).
 */
function UserMenu(props) {

    const [open, setOpen] = useState(true);

    const dispatch = useDispatch();

    const logout = () => {

        dispatch( actions.logoutUser() );

        closeMenu();
    }

    const closeMenu = (event) => {

        setOpen(false);

        props.closeCallback();
    };

    return (

         <Menu
             anchorEl={ props.anchor }
             open={ open }
             onClose={  console.log('Closing UserMenu..') }
             onEntering={ console.log('Entering UserMenu, device style = TABLET') }
             TransitionComponent={ Fade }
         >
             <MenuItem onClick={ () => closeMenu() }>

                <RLink to={{
                      pathname: "/content",
                      search: "?name=Home",
                      hash: "#the-hash",
                      state: { fromDashboard: true }
                    }}>
                    Home
                </RLink>
             </MenuItem>

             <MenuItem onClick={ () => closeMenu() }>

                 <RLink to={{
                       pathname: "/content",
                       search: "?name=Settings",
                       hash: "#the-hash",
                       state: { fromDashboard: true }
                     }}>
                     Settings
                 </RLink>
             </MenuItem>

             <MenuItem onClick={ () => closeMenu() }>

                 <RLink to={{
                       pathname: "/do",
                       search: "?action=logout",
                       hash: "#the-hash",
                       state: { fromDashboard: true }
                     }}>
                     Logout
                 </RLink>

             </MenuItem>

         </Menu>
    );

}