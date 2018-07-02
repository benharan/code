/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"EventBus"
], function (_, $, Backbone, EventBus) {
	var htmlDirection = $('html').css('direction');
	const _tabs_per_scroll_page = 4;

	return Backbone.Model.extend({
		initialize: function ($tabsWrapper) {
			this._initDOMRefs($tabsWrapper);
			this._setControlsVisibility();
			this._bindControls();
			this._initActionMap();

			EventBus.onceAttachedToDOM($tabsWrapper, () => {
				this._calculateMeasurements();
				this._enableDisableControls();
				setTimeout(() => this._scrollTabIntoViewIfNeeded(), 512);
			})

			this.on('tabsModified', () => { // test, theoretical
				this._initDOMRefs($tabsWrapper);
				this._setControlsVisibility();
				this._calculateMeasurements();
				this._enableDisableControls();
				setTimeout(() => this._scrollTabIntoViewIfNeeded(), 512);
			})
		},

		_initDOMRefs: function ($tabsWrapper) {
			let $innerWrapper = $tabsWrapper.find('.tabs-inner-wrapper'),
				$tabs = $tabsWrapper.find('li'),
				$preparedControls = this._generateControls().appendTo($tabsWrapper),
				controls = {
					$prev: $preparedControls.filter(htmlDirection.is('rtl') ? '.next' : '.prev'),
					$next: $preparedControls.filter(htmlDirection.is('rtl') ? '.prev' : '.next'),
					$both: $preparedControls
				};

			$tabs.on('click', this._scrollTabIntoViewIfNeeded.bind(this));

			this._dom = { $tabsWrapper, $tabs, $innerWrapper, controls };
		},

		_calculateMeasurements: function() {
			this._m = {
				selectedTabWidth: this._dom.$tabs.filter('.selected').outerWidth(),
				unselectedTabWidth: this._dom.$tabs.filter(':not(.selected)').outerWidth(),
				totalULWidth: this._dom.$tabsWrapper.outerWidth(),
				totalViewWidth: this._dom.$innerWrapper.width(),
				furthestScroll: this._dom.$innerWrapper[0].scrollWidth - this._dom.$innerWrapper[0].clientWidth
			}
		},

		_scrollTabIntoViewIfNeeded: function () {
			var $selectedTab = this._dom.$tabs.filter('.selected'), selectedsLeft,
				viewScrollLeft = this._dom.$innerWrapper.scrollLeft();
			if ($selectedTab.length) {
				selectedsLeft = $selectedTab.position().left;
				// Scroll into view logic (Comments apply for both LTR and RTL)
				//
				// The rightmost point in view (scrollLeft+viewWidth) is beyond selected tab's right edge (left + selected's width)
				// AKA Too to the right
				if (viewScrollLeft + this._m.totalViewWidth < selectedsLeft + this._m.selectedTabWidth) {
					this._toLeft(selectedsLeft - this._m.totalViewWidth + this._m.selectedTabWidth + 8);
				} else if (viewScrollLeft > selectedsLeft) {
					// The leftmost point in view is before selected tab's left edge (just left)
					// AKA Too to the left
					this._toLeft(selectedsLeft);
				}
			}
		},

		_setControlsVisibility: function () {
			this._dom.controls.$both._toggleShow(this._dom.$tabs.length > _tabs_per_scroll_page);
		},

		_enableDisableControls: function () {
			var scrollLeft = this._dom.$innerWrapper.scrollLeft();
			this._dom.controls.$prev[scrollLeft === 0 ? 'addClass' : 'removeClass']('disabled'); // If leftmost, disable PREV, otherwise enable
			this._dom.controls.$next[scrollLeft === this._m.furthestScroll ? 'addClass' : 'removeClass']('disabled'); // If rightmost, disable NEXT, otherwise enable
		},

		_initActionMap: function () {
			this._actionMap = {
				'next': () => this._dom.$innerWrapper.scrollLeft() + this._m.unselectedTabWidth * _tabs_per_scroll_page,
				'prev': () => this._dom.$innerWrapper.scrollLeft() - this._m.unselectedTabWidth * _tabs_per_scroll_page,
				'toEnd': () => this._m.totalULWidth,
				'toLeft': (left) => left,
			};
			this._toLeft = this._makeScrollabilityAction('toLeft');
		},

		_makeScrollabilityAction: function (action) {
			return (left) => {
				var newLeft = this._actionMap[action](left);

				this._dom.$innerWrapper.animate({scrollLeft: newLeft}, 256, 'swing', () => {
					this._enableDisableControls();
				});
			}
		},

		_bindControls: function () {
			this._dom.controls.$prev.on('click', this._makeScrollabilityAction('prev'));
			this._dom.controls.$next.on('click', this._makeScrollabilityAction('next'));
		},

		_generateControls: function () {
			return $('<button class="prev">PREV</button><button class="next">NEXT</button>');
		}
	})
});
