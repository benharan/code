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
	"text!./ToolsetUI.html",
	"text!./ToolsetUI.css"
], function (_, $, Backbone, Displayable, EventBus, Toolset, html, css) {
	var consolePrintsAreOn = Toolset.ClientStorage.getVal('consolePrints') === '1';

	return Displayable.extend({

		_markupScheme: {
			"cpButton": "button.console-prints",
			"customConsole": ".custom-console"
		},

		events: {
			"click .toolset-ui-toggle": "_toggleUI",
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

			this._toggleUIElem(this._loadState());
			this._applyConsolePrintsState();
			this._initCustomCL();

			return this.$el;
		},

		_initCustomCL: function () {
			window.lcl.customCL = (...args) => {
				const enstringification = args.reduce((acc, arg) => acc + ' | ' + arg);
				this._dom.customConsole.prepend($('<div/>').addClass('console-entry closed').text(enstringification).attr('title', enstringification));
			}
		},

		_clearCustomConsole: function () {
			this._dom.customConsole.empty();
		},

		_toggleUIElem: function (toOpen) {
			this.$el.toggleClass('open', toOpen);
		},

		_toggleUI: function () {
			this._toggleUIElem(this._saveState(!this.$el.hasClass('open')));
		},

		_toggleEntry: function (e) {
			$(e.target).toggleClass('closed');
		},

		_saveState: function (isOpen) {
			this._state = isOpen;
			Toolset.ClientStorage.setVal('toolset-ui-isOpen', +this._state);
			return this._state;
		},

		_loadState: function () {
			this._state = Toolset.ClientStorage.getVal('toolset-ui-isOpen') === '1';
			return this._state;
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
		}
	})
});
