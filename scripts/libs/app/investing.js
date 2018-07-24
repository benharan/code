window.InvestingApp = {};

define([
    "underscore",
    "jquery",
    "Backbone",
	"External/lz-string",
	"Toolset/Toolset",
	"Modules/ToolsetUI/ToolsetUIView",
    "Modules/mainFrame/mainFrame",
    "Modules/User/User",
    "./router"
], function (_, $, Backbone, LZstring, Toolset, ToolsetUIView, MainFrame, User, Router) {
    var investingApp;

    window.InvestingApp.Router = {};
    window.InvestingApp.root = '/';

    investingApp = Backbone.Model.extend({
        init: function () {
            let router = new Router(),
                main_frame = new MainFrame(),
                $body = $(document.body);

			$body.append(main_frame.render());

			// {{ Dev Only Code {{
			this._toolsetUIView = new ToolsetUIView();
			$body.append(this._toolsetUIView.render());
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
