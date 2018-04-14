/**
 * Created by Skeksify on 09/07/2016.
 */

requirejs.config({
    baseUrl: "/scripts/libs",
    paths: {
        Displayable: "app/modules/displayable/displayable",
        Toolset: "app/modules/toolset",
        Modules: "app/modules"
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
