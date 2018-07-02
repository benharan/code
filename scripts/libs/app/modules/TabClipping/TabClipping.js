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

		_alreadyRendered: null,

		initialize: function ($tabsWrapper, alreadyRendered) {
			this._dom = {};
			this._alreadyRendered = !!alreadyRendered; // Todo: Initialize without rendering

			// Needs to be in DOM for element size calculations
			EventBus.on('mainFrameInsertion', this._initializeClippedTabs.bind(this, $tabsWrapper));
		},

		_initializeClippedTabs: function ($tabsWrapper) {
			this._initDOMRefs($tabsWrapper);
			this._enumerateTabs();
			this._bindTabClick(this._dom.$outcastTabs);
			this._initControls();
			this._switchToSelectedIfOutcast();
		},

		_outcastTabs: function ($revealedTabs, $innerWrapper) {
			let $aTab = $revealedTabs.first(),
				wrapperWidth = $innerWrapper.width(),
				outerWidth = $aTab.outerWidth(true),
				maxVisibleTabs = Math.floor(wrapperWidth / outerWidth),
				$outcastTabs = $($revealedTabs.splice(maxVisibleTabs)); // Mutate

			return $outcastTabs;
		},

		_initControls: function () {
			let $controls = this._generateControls(),
				$moreTabsContainer = $controls.find('.more-tabs'),
				$showMoreButton = $controls.find('.show-more'),
				$outcastTabsUL = $('<ul/>').html(this._dom.$outcastTabs);

			$moreTabsContainer.html($outcastTabsUL);
			this._dom.$moreTabsContainer = $moreTabsContainer;
			this._dom.$innerWrapper.append($controls);
			$showMoreButton.on('click', () => $moreTabsContainer._toggleShow());
		},

		_switchToTab: function ($tabToReveal) {
			let $lastRevealed = this._dom.$revealedTabs.last();

			// Outcast last revealed
			this._dom.$outcastTabs.eq($lastRevealed.data('initial-order') || 0).before($lastRevealed);
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
				$revealedTabsUL = $tabsWrapper.find('ul'),
				$revealedTabs = $revealedTabsUL.find('li'),
				$outcastTabs = this._outcastTabs($revealedTabs, $innerWrapper);

			this._dom = {$innerWrapper, $revealedTabsUL, $revealedTabs, $outcastTabs};
		},

		_enumerateTabs: function () {
			_.e(this._dom.$outcastTabs, (tab, orderId) => $(tab).data('initial-order', orderId + 1));
		},

		_generateControls: function () {
			return $('<div class="clip-controls"><span class="show-more">...</span><div class="more-tabs displayNone"></div></div>');
		},

		closeDialog: function () {
			this._dom.$moreTabsContainer._hide();
		},

		_tabClick: function (e) {
			this._switchToTab($(e.target));
		}
	})
});
