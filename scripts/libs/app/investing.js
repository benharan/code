/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "./models/mainFrame/mainFrame",
    "./router"
], function (_, $, Backbone, Utils, MainFrame, Router) {
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
            var router = new Router();
            router.on('navigation', function (a,b,c,d) {
                cl('@#$@#$@#$',a,b,c,d);
                debugger;
            });
            let main_frame = new MainFrame();
            $('body').append(main_frame.render());
        }
    });

    return new investingApp();
});
