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
	const _default_settings = { };
	let consolePrintsAreOn = Toolset.ClientStorage.getVal('consolePrints') === '1';

	/**
	 * Implement a "Feature Selection" popup to enable
	 * checking/unchecking of wanted Control Panel features
	 *
	 * Todo: Dark Theme!
	 */


	return Displayable.extend({

		_settings: null,

		_markupScheme: {
			"cpButton": "button.console-prints",
			"customConsole": ".custom-console",
			"debugDelayInput": ".debug-delay-input",
			"debugDelayButton": ".debug-delay",
			"featureSelectionDialog": ".feature-selection",
			"featureSelectionCheckboxes": ".feature-selection input[type=checkbox]",
			"settingGroups": "[setting-group]",
			"debugDelayStop": ".debug-delay-stop"
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
			"click .debug-delay": "_debugDelay",
			"click .select-features": "_featureSelection",
		},

		initialize: function () {
			Displayable.prototype.initialize.call(this, html, css);
			this._settings = Toolset.ClientStorage.getObj('controlPanelSettings') || _default_settings;
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._applySettings();
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
				this._dom.customConsole.prepend($('<div/>').setup({
					addClass: 'console-entry closed',
					text: enstringification,
					attr: ['title', enstringification]
				}));

				// this._dom.customConsole.prepend($('<div/>').addClass('console-entry closed').text(enstringification).attr('title', enstringification));
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

		_featureSelection: function () {
			this._applySettingsToCheckboxes();
			Toolset.Modal.setup({
				title: 'Control Panel Feature Selection',
				$content: this._dom.featureSelectionDialog._show(),
				type: 'okCancel',
				onOk: () => this._applyCheckboxesToSettings(),
			});
		},

		_applySettingsToCheckboxes: function () {
			this._dom.featureSelectionCheckboxes.uncheck();
			_.e(this._dom.featureSelectionCheckboxes, checkbox => {
				let $cb = $(checkbox);
				$cb.toggleCheck(this._settings[$cb.data('featureName')]);
			})
		},

		_applyCheckboxesToSettings: function () {
			_.e(this._dom.featureSelectionCheckboxes, checkbox => {
				let $cb = $(checkbox);
				this._settings[$cb.data('featureName')] = $cb.isChecked();
			})
			Toolset.ClientStorage.setObj('controlPanelSettings', this._settings);
			this._applySettings();
		},

		_applySettings: function () {
			_.e(this._dom.settingGroups, group => {
				let $g = $(group);
				$g._toggleShow(this._settings[$g.attr('setting-group')]);
			})
		},

		_debugDelay: function () {
			let originalDelay = this._dom.debugDelayInput.val(),
				delay = parseInt(originalDelay) || 500,
				refreshRate = 25,
				refreshCount = 1,
				delayRefreshInterval = setInterval(() => {
					this._dom.debugDelayInput.val(delay - (refreshRate * refreshCount++))
				}, refreshRate),
				delayTimeout = setTimeout(() => {
					clearInterval(delayRefreshInterval);
					this._dom.debugDelayStop._hide();
					this._dom.debugDelayButton._show();
					this._dom.debugDelayInput.val(originalDelay);
					debugger;
				}, delay);

			this._dom.debugDelayButton._hide();
			this._dom.debugDelayStop._show().off('click.stop').on('click.stop', () => {
				clearInterval(delayRefreshInterval);
				clearTimeout(delayTimeout);
				this._dom.debugDelayInput.val(originalDelay);
				this._dom.debugDelayButton._show();
				this._dom.debugDelayStop._hide();
			})

		},

	})
});
