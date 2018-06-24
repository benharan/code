/**
 * Created by Skeksify on 09/07/2016.
 */

requirejs.config({
    baseUrl: "/scripts/libs",
	waitSeconds: 200,
    paths: {
        Displayable: "app/modules/displayable/displayable",
        Toolset: "app/modules/toolset",
        Modules: "app/modules",
        Schemes: "app/schemes"
        // CDN Path?
    },
    shim: {
        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        underscore: {
            deps: [],
            exports: "_"
        }
    }
});
