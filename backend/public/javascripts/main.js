/* main.js loaded by require.js; config see rjs_config.js */
define(['require','jquery'], (require, $) => {

    // use jquery in first place
    let userMenuIconDiv = $('#user_menu_icon');
    let leftDetailsDiv = $('#left_details_panel');
    let mainPanelDiv = $('#main_panel');
    let userMenuDiv = $('#user_menu_icon');
    let bottomPanelDiv = $('#footer_menu');
    let quickLinksMenu = $('#quick_links');

    const device = detectDevice();

    // only load app on tablet or smartphone
    if(device == supportedDevices.TABLET) {

        console.log('Tablet detected - decorating the web!');

        // 'sposo_app' dependency to be defined in rjs_config.js!
        require(['sposo_deco'], (spoSo) => {

            // React app wants native DOM elements!
            spoSo.decorate(
                userMenuIconDiv.get(0),
                leftDetailsDiv.get(0),
                mainPanelDiv.get(0),
                userMenuDiv.get(0),
                bottomPanelDiv.get(0),
            );

            return function() {
                // Any exports?
            }
        });
    }
    else if(device == supportedDevices.MOBILE) {

         console.log('Smartphone detected - starting APP');

         require(['sposo_app'], (spoSo) => {

             // since the sections defined in the HTML version are not desired, we have to strip them off..
             $('body>header').remove();
             $('body>main').remove();
             $('body>footer').remove();

             // ..and append a new "root" element:
             let rootEl = $('body').append('<div id="react_root"></div>');
             spoSo.boot(rootEl.get(0));

             return function() {
                 // Any exports?
             }
         });
    }
    // else: do whatever good old jQuery can improve for usability!

    return function() {
        // Any exports?
    }
});

// since this script is loaded first, it can be used to define some global vars and utility functions -
// maybe not good practice since in component framework it is not obvious where these come from!
var supportedDevices = {
    DESKTOP: '992px',
    TABLET: '768px',
    MOBILE: '576px'
};

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