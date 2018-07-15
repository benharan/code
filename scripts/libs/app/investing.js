window.InvestingApp = {};

define([
    "underscore",
    "jquery",
    "Backbone",
	"External/lz-string",
	"Toolset/Toolset",
    "Modules/mainFrame/mainFrame",
    "Modules/Mutators/underscoreMutator",
    "Modules/Mutators/jQueryMutator",
    "Modules/Mutators/backboneMutator",
    "./router"
], function (_, $, Backbone, lzstring, Toolset, MainFrame, underscoreMutator, jQueryMutator, backboneMutator, Router) {
    var investingApp;

    window.InvestingApp.Router = {};
    window.InvestingApp.root = '/';

    investingApp = Backbone.Model.extend({
        init: function () {
            let router = new Router(),
                main_frame = new MainFrame();

            $(document.body).append(main_frame.render());
            router.on('navigation', function (...params) {
                main_frame.navigate(...params);
            });

            Backbone.history.start({
                pushState: true,
                root: window.InvestingApp.root
            });
        }
    });

    return new investingApp();
});
