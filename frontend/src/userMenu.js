import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { sposoStyles, device, supportedDevices } from './sposoStyles.js';
import { Icon, Button, Menu, MenuItem, Fade, Popover, Link, Dialog, DialogTitle, DialogContent, DialogActions, Input, InputLabel, SwipeableDrawer } from '@material-ui/core';
import * as actions from './actions.js';
import { fetchJson, sendJson, loadPage } from './backend.js';
//import { useLogin } from './userLogin.js';

const useStyles = makeStyles(sposoStyles);

/*
 * Wraps the user icon button and acts as starting point for the different login states, e.g. show the user menu when
 * already logged in or, offer a login screen when the user is unknown.
 */
export function UserMenuCtl(props) {

    const userState = useSelector(state => state.userState);

    const [anchorEl, setAnchorEl] = useState(null);

    const mainPanelRef = props.mainPanel;

    const openMenu = (event) => {

        /* use the Button as anchor element for the menu */
        setAnchorEl(event.target);
    };

    const hideMenu = (args) => {

        setAnchorEl(null);
    };

    /* Depending on whether user is logged-in, display user menu or log-in notification */
    const chooseMenu = () => {

        if(Boolean(userState.user)) {

            return <UserMenu
                        closeCallback={ hideMenu }
                        anchor={ anchorEl }
                        user={ userState.user }
                        contentPanel= { mainPanelRef } />;
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
                Boolean(anchorEl) ? chooseMenu() : null
            }

        </div>
    );
}

/* The React Icon element that replaces the SVG file used in the template. */
function UserIcon(props) {

    const classes = useStyles(props);

    const userState = useSelector(state => state.userState);

    return (

        Boolean(userState) ?

            <img className={classes.userButton} src="/assets/images/runner-color-border.svg"></img>

        :

            <img className={classes.userButton} src="/assets/images/runner-color.svg"></img>
    );
}

/* Show a pseudo-menu when user is not logged-in; offer login button. */
function NotLoggedMenu(props) {

    const classes = useStyles(props);

    const [open, setOpen] = useState(true);

    const [showDialog, setShowDialog] = useState(false);

    const handleClose = (event) => {

        setShowDialog(false);

        props.closeCallback();
    }

    const openLoginDialog = (event) => {

        setShowDialog(true);

        //props.closeCallback();
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

                <p className={classes.loginMenuNotLoggedTitle}>Not logged in. </p>

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

    const classes = useStyles(props);

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

                console.log('userDate invalid! Message: ' + userData['invalid']);
            }
            else {

                dispatch(actions.registerUser(userData));

                console.log('userData OK.. String value: ' + userData.toString());
            }
        }

        catch(err){

            dispatch(actions.logError(err));

            console.log('An error occurred: ' + err);
        }
     };

    useEffect(
        () => { loadUserData() },

        // .. but only trigger this load when trialsCounter was incremented - see action button in login dialog
        [trialsCounter]
     );

    console.log('LoginDialog, result: ' + JSON.stringify(userState) + ', trialsCounter: ' + trialsCounter);

    const closeDialog = () => {

        setOpen(false);

        props.closeCallback();
    };

    return (

        <Dialog open={ open } onClose={ closeDialog }  aria-labelledby="simple-dialog-title">

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
                    className={ classes.loginButton }
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

/* The user menu shown when the user is already logged-in.
 * User object available via props.user (read-only)
 */
function UserMenu(props) {

    const [open, setOpen] = useState(false);

    const [displayStyle, setDisplayStyle] = useState(device);

    const dispatch = useDispatch();

    const closeMenu = () => {

        setOpen(false);

        props.closeCallback();
    };

    const showContent = (url) => {

        var page = loadPage(url);

        props.contentPanel.innerHtml = page;
    }

    const logout = () => {

        dispatch( actions.logoutUser() );

        props.closeCallback();
    }

    if(displayStyle == supportedDevices.DESKTOP) {

        return (

            <Menu
                id="user-menu"
                anchorEl={ props.anchor }
                open={ open }
                onClose={ closeMenu }
                TransitionComponent={ Fade }
            >
                <MenuItem onClick={ () => showContent('/user_profile') }>Profile</MenuItem>

                <MenuItem onClick={ () => showContent('/user_settings') }>Settings</MenuItem>

                <MenuItem onClick={ () => logout }>Logout</MenuItem>

            </Menu>

        );

    } else if([supportedDevices.TABLET, supportedDevices.MOBILE].includes(displayStyle)) {

        return (

             <SwipeableDrawer anchor='right' open={ open } onClose={ closeMenu }>

                list (JSON.stringify(props.user['email']), 'Nachrichten', 'Settings' )

             </SwipeableDrawer>
         );

    } else {

        return (

            <SwipeableDrawer anchor='right' open={ open } onClose={ closeMenu }>

                <p>Drawer (default)</p>

            </SwipeableDrawer>
         );
     }
}

function UserContent(props) {

    render(
        props.page
    );
}