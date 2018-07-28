/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"EventBus",
	"Toolset/Toolset",
	"Modules/DynamicElement/DynamicElement",
	"text!./ControlPanel.html",
	"text!./ControlPanel.css"
], function (_, $, Backbone, Displayable, EventBus, Toolset, DynamicElement, html, css) {
	var consolePrintsAreOn = Toolset.ClientStorage.getVal('consolePrints') === '1';

	/**
	 * Implement a "Feature Selection" popup to enable
	 * checking/unchecking of wanted Control Panel features
	 *
	 * Todo: Dark Theme!
	 */

	return Displayable.extend({

		_markupScheme: {
			"cpButton": "button.console-prints",
			"customConsole": ".custom-console"
		},

		events: {
			"click .console-prints": "_toggleConsolePrints",
			"click .clear-console": "_clearCustomConsole",
			"click .clear-template-cache": "_clearTemplateCache",
			"click .render-templates": "_renderTemplates",
			"click .load-portfolios": "_loadPortfolios",
			"click .console-entry": "_toggleEntry",
			"click .append-more-rows-button2": "_append1k",
			"click .login": "_loginFromUI",
		},

		initialize: function () {
			Displayable.prototype.initialize.call(this, html, css);

		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._applyConsolePrintsState();
			this._initCustomCL();

			return this.$el;
		},

		initConsoleResize: function () {
			new DynamicElement({
				lsKey: 'controlPanel',
				$element: this.$el,
				resize: {
					$resizeBar: this.$el.f('.toolset-resize-area'),
					boundaries: {
						height: val => 0 < val && val < 400
					}
				}
			})
		},

		_initCustomCL: function () {
			window.lcl.customCL = (...args) => {
				let enstringification = args.join(' | ')
				this._dom.customConsole.prepend($('<div/>').addClass('console-entry closed').text(enstringification).attr('title', enstringification));
			}
		},

		_clearCustomConsole: function () {
			this._dom.customConsole.empty();
		},

		_toggleEntry: function (e) {
			$(e.target).toggleClass('closed');
		},

		_toggleConsolePrints: function () {
			consolePrintsAreOn = !consolePrintsAreOn;
			cl(`Console Prints are ${consolePrintsAreOn ? 'On' : 'Off'}`);
			this._applyConsolePrintsState();
		},

		_applyConsolePrintsState: function () {
			Toolset.ClientStorage.setVal('consolePrints', +consolePrintsAreOn);
			window.lcl.flag = consolePrintsAreOn;
			this._dom.cpButton.text(`Console Prints (${consolePrintsAreOn ? 'On' : 'Off'})`);
		},

		_clearTemplateCache: function () {
			Toolset.ClientStorage.clearVal('templates');
			EventBus.trigger('dropTemplates');
			lcl('Templates Cleared');
		},

		_renderTemplates: function () {
			EventBus.trigger('RenderTemplates');
		},

		_loadPortfolios: function () {
			EventBus.trigger('loadTemplate', 'portfolios', 'portfolios')
		},

		_append1k: function () {
			EventBus.trigger('append1k');
		},

		_loginFromUI: function () {
			EventBus.trigger('loginFromUI');
		},

	})
});
