define([
    "underscore",
    "jquery",
    "Backbone",
	"Toolset/toolset",
    "Modules/mainFrame/mainFrame",
    "Modules/mutators/underscoreMutator",
    "Modules/mutators/jQueryMutator",
    "Modules/mutators/backboneMutator",
    "./router"
], function (_, $, Backbone, Toolset, MainFrame, underscoreMutator, jQueryMutator, backboneMutator, Router) {
    var investingApp;

    window.InvestingApp = {
        Router: {},
        root: '/'
    }

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
