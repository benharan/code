/**
 * Created by Skeksify on 09/07/2016.
 */

requirejs.config({
    baseUrl: "scripts/libs",
    paths: {
        utils: "../../scripts/app/utils"
    },
    shim: {
        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        underscore: {
            exports: "_"
        }
    }
});
