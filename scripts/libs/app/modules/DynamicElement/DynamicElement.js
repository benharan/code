/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/Toolset",
	"Displayable"
], function (_, $, Backbone, Toolset, Displayable) {
	return Displayable.extend({

		_state: null,
		_settings: null,
		_markupScheme: {},

		/*
		 * *** Settings API ***
		 *
		 * + - Mandatory, ? - Optional (Applicable if supplied), * - Supports Multiple
		 * {
		 * +	$element, (Element to transform)
		 * ?	lsKey, (Persist state through LS)
		 * ?	resize: {
		 * 		+	$resizeBar, (Element to drag)
		 * 		?	boundaries: { (Property to Value validation function hash)
		 *			?*	property: valueInBoundariesFunction,
		 * 			}
		 * 		}
		 * }
		 */

		initialize: function (settings) {
			Displayable.prototype.initialize.call(this, settings.$element, '', true);

			this._state = {};
			this._settings = settings;
			if (this._settings.lsKey) {
				this._loadState();
			}
			if (settings.resize) {
				this._initializeResizablity();
			}
		},

		_loadState: function () {
			this._state = Toolset.ClientStorage.getObj(this._settings.lsKey) || {};
			_.e(this._state, (state, property) => { // Apply saved properties
				this.$el[property](state);
			})
		},

		_initializeResizablity: function () {
			let rSettings = this._settings.resize,
				startingHeight = this.$el.height(),
				heightBoundary = rSettings.boundaries ? rSettings.boundaries.height : null,
				startY, lastResult = startingHeight, togglePoint = 0,
				saveHeight = () => {
					startingHeight = lastResult;
					this._state.height = lastResult;
					if (this._settings.lsKey) {
						Toolset.ClientStorage.setObj(this._settings.lsKey, this._state);
					}
					window.preventTouchScrollFlag = false;
					$(document.body).rCl('lock-screen-touch-scroll');
				};

			rSettings.$resizeBar.on('dragstart touchstart', e => {
				startingHeight = this.$el.height();
				startY = e.originalEvent.clientY || e.originalEvent.touches[0].clientY;
				window.preventTouchScrollFlag = true;
				$(document.body).aCl('lock-screen-touch-scroll');
			})

			rSettings.$resizeBar.on('drag touchmove', _.throttle(e => {
				let offset = startY - (e.originalEvent.clientY || e.originalEvent.touches[0].clientY),
					result = startingHeight + offset + 20;

				if (lastResult !== result && (!heightBoundary || heightBoundary(result))) {
					this.$el.height(result);
					lastResult = result;
				}
			}, 16))

			rSettings.$resizeBar.on('dragend touchend', saveHeight)

			// Todo: Generalize
			rSettings.$resizeBar.on('click', () => {
				if (lastResult) {
					togglePoint = lastResult;
					lastResult = 0;
				} else {
					lastResult = togglePoint;
				}
				this.$el.height(lastResult);
				saveHeight();
			})
		}
	})
});
