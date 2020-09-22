/* main.js loaded by require.js; config see rjs_config.js */
define(['require','jquery'], (require, $) => {

    // use jquery in first place
    let userMenuIconDiv = $('#user_menu_icon_div');
    let leftDetailsDiv = $('#left_details_panel');
    let mainPanelDiv = $('#main_panel');
    let userMenuDiv = $('#right_details_panel');
    let bottomPanelDiv = $('#footer_menu');

    const device = detectDevice();

    // only load app on tablet or smartphone
    if([supportedDevices.TABLET,supportedDevices.MOBILE].includes(device)) {

        console.log('Smartphone or Tablet detected - decorating the web!');

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
    // else { do whatever good old jQuery can improve for usability! }

    return function() {
        // Any exports?
    }
});

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