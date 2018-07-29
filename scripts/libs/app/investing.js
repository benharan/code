window.InvestingApp = {};

define([
    "underscore",
    "jquery",
    "Backbone",
	"External/lz-string",
	"Toolset/Toolset",
	"try!Modules/ControlPanel/ControlPanelView",
    "Modules/mainFrame/mainFrame",
    "Modules/User/User",
    "Modules/PageState/PageState",
    "./router"
], function (_, $, Backbone, LZstring, Toolset, ControlPanelView, MainFrame, User, PageState, Router) {
    var investingApp;

    window.InvestingApp.Router = {};
    window.InvestingApp.root = '/';

    investingApp = Backbone.Model.extend({
        init: function () {
            let router = new Router(),
                main_frame = new MainFrame(),
                $body = $(document.body);

			main_frame.render();

			// {{ Dev Only Code {{
			this._controlPanelView = new ControlPanelView();
			$body.append(this._controlPanelView.render());
			this._controlPanelView.initConsoleResize();
			// }} Dev Only Code }}

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
