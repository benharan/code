define([
    "underscore",
    "jquery",
    "Backbone",
    "Modules/mainFrame/mainFrame",
    "Modules/jQueryMutator/jQueryMutator",
    "./router"
], function (_, $, Backbone, MainFrame, jQueryMutator, Router) {
    var investingApp;

    window.InvestingApp = {
        Router: {},
        root: '/'
    }
    investingApp = Backbone.Model.extend({
        init: function () {
            var router = new Router(),
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
