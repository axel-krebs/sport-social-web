require(['jquery','sposo-uilib/bundle'],
            function($, sposoUI) {

    // use jquery, UI lib
    let userMenu = $('#user_menu_div');
    let userButton = $('#user-logo-button');
    let qlMenu = $('#quickLinks');
    let mainPanel = $('#main_panel');
    let match1050 = window.matchMedia('screen and (max-width: 1050px)');
    if(match1050.matches) {
        hideUserMenu();
    }
//    qlMenu.detach();
//    $('#left_details_panel').prepend(qlMenu);

    function hideUserMenu() {
        userMenu.detach();
        userButton.click(function(evt) {
            let mainPos = mainPanel.position();
            let topOff = mainPos.top;
            let rightOff = mainPos.right;
            userMenu.css({"position":"absolute","z-index":"100","right":"0px","top":`${topOff}px`});
            mainPanel.bind("click", (evt) => userMenu.detach());
            document.body.appendChild(userMenu.get(0));
        });
    }

    return function() {};
});