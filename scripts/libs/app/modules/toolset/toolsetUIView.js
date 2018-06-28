/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"EventBus",
	"text!./toolsetUI.html",
	"text!./toolsetUI.css"
], function (_, $, Backbone, Displayable, EventBus, html, css) {
	var consolePrintsIsOn = localStorage.getItem('consolePrints') === '1';

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
			"click .compile-templates": "_compileTemplates",
			"click .load-portfolios": "_loadPortfolios",
			"click .console-entry": "_toggleEntry"
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
			localStorage.setItem('toolset-ui-isOpen', +this._state);
			return this._state;
		},

		_loadState: function () {
			this._state = localStorage.getItem('toolset-ui-isOpen') === '1';
			return this._state;
		},

		_toggleConsolePrints: function (){
			consolePrintsIsOn = !consolePrintsIsOn;
			cl(`Console Prints are ${consolePrintsIsOn ? 'On' : 'Off'}`);
			this._applyConsolePrintsState();
		},

		_applyConsolePrintsState: function () {
			localStorage.setItem('consolePrints', +consolePrintsIsOn);
			window.lcl.flag = consolePrintsIsOn;
			this._dom.cpButton.text(`Console Prints (${consolePrintsIsOn ? 'On' : 'Off'})`)
		},

		_clearTemplateCache: function () {
			localStorage.removeItem('templates');
			EventBus.trigger('dropTemplates');
			lcl('Templates Cleared');
		},

		_compileTemplates: function () {
			EventBus.trigger('CompileTemplates');
		},

		_loadPortfolios: function () {
			EventBus.trigger('loadTemplate', 'portfolios', 'portfolios')
		}
	})
});
