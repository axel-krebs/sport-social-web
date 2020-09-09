/* Dynamically calculate style properties according to device, th.i. screen width. */
import React, { useEffect } from 'react';

export const supportedDevices = {
    DESKTOP: '1050px',
    TABLET: '820px',
    MOBILE: '560px'
};

export const device = detectDevice();

function detectDevice() {
    let mobileMatch = window.matchMedia('screen and (max-width: ' + supportedDevices.MOBILE + ')');
    let tabletMatch = window.matchMedia('screen and (max-width: ' + supportedDevices.TABLET + ')');
    let desktopMatch = window.matchMedia('screen and (max-width: ' + supportedDevices.DESKTOP + ')');
    if(mobileMatch.matches){
        return supportedDevices.MOBILE;
    }
    else if(tabletMatch.matches){
        return supportedDevices.TABLET;
    }
    else if(desktopMatch.matches){
        return supportedDevices.DESKTOP;
    }
    else {
        return supportedDevices.DESKTOP;
    }
}

const calcButtonHeight = () => {
    switch(device) {
        case supportedDevices.MOBILE: return '30px';
        case supportedDevices.TABLET: return '45px';
        case supportedDevices.DESKTOP: return '60px';
        default: return '50px';
    }
}

/* Rather static CSS definitions. */
export const sposoStyles = {
    userButton: {
        backgroundRepeat: 'no-repeat',
        minWidth: '25px',
        minHeight: '25px',
        height: calcButtonHeight
    },
    loginButton: {
        margin: '3px',
    },
    loginErrorMsg: {
        padding: 0,
        color: 'red',
        fontWeight: 'bold',
    },
    loginMenuNotLoggedTitle: {

    }
};
