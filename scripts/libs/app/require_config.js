/**
 * Created by Skeksify on 09/07/2016.
 */

requirejs.config({
    baseUrl: "/scripts/libs",
    paths: {
        Displayable: "app/models/displayable/displayable",
        Toolset: "app/models/toolset"
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
