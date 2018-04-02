define([
    "underscore",
    "jquery",
    "Backbone",
    "./models/mainFrame/mainFrame",
    "./router"
], function (_, $, Backbone, MainFrame, Router) {
    var investingApp;
    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        root: '/'
    }
    investingApp = Backbone.Model.extend({
        init: function () {
            var router = new Router(),
                main_frame = new MainFrame();

            $('body').append(main_frame.render());
            router.on('navigation', function (section, p1, p2) {
                main_frame.navigateTo(section, p1, p2);
            });
            Backbone.history.start({
                pushState: true,
                root: window.App.root
            });
        }
    });

    return new investingApp();
});
