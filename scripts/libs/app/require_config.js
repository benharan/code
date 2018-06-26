/**
 * Created by Skeksify on 09/07/2016.
 */

requirejs.config({
    baseUrl: "/scripts/libs",
	waitSeconds: 200,
    paths: {
        Displayable: "app/modules/Displayable/Displayable",
        Toolset: "app/modules/toolset",
		EventBus: "app/modules/EventBus/EventBus",
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
