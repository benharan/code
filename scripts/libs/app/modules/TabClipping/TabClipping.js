/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"EventBus"
], function (_, $, Backbone, EventBus) {
	return Backbone.Model.extend({

		_prerendered: null,

		initialize: function ($tabsWrapper, prerendered) {
			this._dom = {};
			if (prerendered) {
				this._prerendered = true;
				this._initializeClippedTabs($tabsWrapper);
			} else {
				EventBus.onceAttachedToDOM($tabsWrapper, this._initializeClippedTabs.bind(this, $tabsWrapper));
			}

		},

		_initializeClippedTabs: function ($tabsWrapper) {
			this._initDOMRefs($tabsWrapper);
			this._enumerateTabs();
			this._bindTabClick(this._dom.$outcastTabs);
			this._initControls();
			this._switchToSelectedIfOutcast();
		},

		_outcastTabs: function ($revealedTabs, $innerWrapper) {
			let $result;
			if (this._prerendered) {
				$result = $innerWrapper.find('.more-tabs ul li');
			} else {
				let $aTab = $revealedTabs.first(),
					wrapperWidth = $innerWrapper.width(),
					outerWidth = $aTab.outerWidth(true),
					maxVisibleTabs = Math.floor(wrapperWidth / outerWidth);
				$result = $($revealedTabs.splice(maxVisibleTabs)); // Mutate
			}
			return $result;
		},

		_initControls: function () {
			let $controls = this._getControls(),
				$moreTabsContainer = $controls.find('.more-tabs'),
				$showMoreButton = $controls.find('.show-more');

			if (!this._prerendered) {
				let $outcastTabsUL = $('<ul/>').html(this._dom.$outcastTabs);
				$moreTabsContainer.html($outcastTabsUL);
				this._dom.$innerWrapper.append($controls);
			}

			this._dom.$moreTabsContainer = $moreTabsContainer;
			$showMoreButton.on('click', () => $moreTabsContainer._toggleShow());
		},

		_outcastTab: function ($subject) {
			let $succeedingTab = this._dom.$outcastTabs.eq($subject.data('initial-order') || 0);
			if ($succeedingTab.exists()) {
				$succeedingTab.before($subject);
			} else { // Last, no succeeding elem
				this._dom.$outcastTabs.last().after($subject);
			}
		}, 
		
		_switchToTab: function ($tabToReveal) {
			let $lastRevealed = this._dom.$revealedTabs.last();

			// Outcast last revealed
			this._outcastTab($lastRevealed);
			// Reveal this tab
			this._dom.$revealedTabsUL.append($tabToReveal);
			// Update References
			this._dom.$outcastTabs = this._dom.$innerWrapper.find('.more-tabs ul>li');
			this._dom.$revealedTabs = this._dom.$innerWrapper.find('>ul>li');

			this._bindTabClick($tabToReveal, true);
			this._bindTabClick($lastRevealed, false);
		},

		_switchToSelectedIfOutcast: function () {
			let $outcastSelected = this._dom.$outcastTabs.filter('.selected');
			$outcastSelected.exists() && this._switchToTab($outcastSelected);
		},

		_bindTabClick: function ($tabsToBind, unbind) {
			if (!unbind) {
				$tabsToBind.on('click.outcastClick', this._tabClick.bind(this));
			} else {
				$tabsToBind.off('click.outcastClick');
			}
		},

		_initDOMRefs: function ($tabsWrapper) {
			let $innerWrapper = $tabsWrapper.find('.tabs-inner-wrapper'),
				$revealedTabsUL = $tabsWrapper.find('ul.main'),
				$revealedTabs = $revealedTabsUL.find('li'),
				$outcastTabs = this._outcastTabs($revealedTabs, $innerWrapper);

			this._dom = {$innerWrapper, $revealedTabsUL, $revealedTabs, $outcastTabs};
		},

		_enumerateTabs: function () {
			_.e(this._dom.$outcastTabs, (tab, orderId) => $(tab).data('initial-order', orderId + 1));
		},

		_getControls: function () {
			let $result;
			if (this._prerendered) {
				$result = this._dom.$innerWrapper.find('.clip-controls');
			} else {
				$result = $('<div class="clip-controls"><span class="show-more">...</span><div class="more-tabs displayNone"></div></div>');
			}
			return $result;
		},

		closeDialog: function () {
			this._dom.$moreTabsContainer._hide();
		},

		_tabClick: function (e) {
			this._switchToTab($(e.target));
		}
	})
});
