/* Require-JS config modularized for availability in multiple modules. */
var require = {
    baseUrl: 'assets/lib',
    paths: {
        jquery : 'jquery/jquery.min',
        jqUI: 'jquery-ui/jquery-ui.min',
        SpoSoComp: 'sposo-uilib/bundle',
        main: './main.js'
    },
    shim : {
        'jquery-ui/jquery-ui.min' : {
            deps: ['jquery'],
            exports: "jqUI"
        }
    }
};