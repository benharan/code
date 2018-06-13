define([
    "underscore",
    "jquery",
    "Backbone",
	"Toolset/toolset",
    "Modules/mainFrame/mainFrame",
    "Modules/jQueryMutator/jQueryMutator",
    "Modules/backboneMutator/backboneMutator",
    "./router"
], function (_, $, Backbone, Toolset, MainFrame, jQueryMutator, backboneMutator, Router) {
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
            router.on('navigation', main_frame.navigate.bind(main_frame));

            Backbone.history.start({
                pushState: true,
                root: window.InvestingApp.root
            });
        }
    });

    return new investingApp();
});
