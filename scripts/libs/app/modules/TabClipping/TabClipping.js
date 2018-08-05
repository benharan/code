/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"EventBus",
	"Modules/SortableList/SortableList"
], function (_, $, Backbone, EventBus, SortableList) {
	const _revealed_tab_classes = 'button-tabs-item no-mobile',
		_outcast_tab_classes = 'drop-comp-item not-editable';

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

		closeDialog: function () {
			this._dom.$moreTabsContainer._hide();
		},

		_initializeClippedTabs: function ($tabsWrapper) {
			this._initDOMRefs($tabsWrapper);
			this._enumerateTabs();
			this._bindTabClick(this._dom.$outcastTabs);
			this._initControls();
			this._initSortability(); // Dimmu Borgir!
		},

		_outcastTabs: function ($revealedTabs, $innerWrapper) {
			let $result;
			if (this._prerendered) {
				$result = $innerWrapper.find('.mini-popup-content>ul>li');
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
				$moreTabsContainer = $controls.find('>.mini-popup>.mini-popup-wrapper'),
				$showMoreButton = $controls;

			if (!this._prerendered) {
				let $outcastTabsUL = $('<ul/>').html(this._dom.$outcastTabs);
				$moreTabsContainer.html($outcastTabsUL);
				this._dom.$innerWrapper.append($controls);
				this._dom.$outcastTabsUL = $outcastTabsUL;
			}

			this._dom.$moreTabsContainer = $moreTabsContainer;
			$showMoreButton.on('click', () => $moreTabsContainer._toggleShow());
			$moreTabsContainer.on('click', e => e.stopPropagation());
		},

		_switchToTab: function ($tabToReveal) {
			let $lastRevealed = this._dom.$revealedTabs.last();

			this._revealTab($tabToReveal, $lastRevealed);
			this._outcastTab($lastRevealed); // Note the var name change according to context

			this._updateOutcastTabsDOMRef();
			this.updateRevealedTabsDOMRef();

			this._bindTabClick($tabToReveal, true);
			this._bindTabClick($lastRevealed, false);
		},

		_outcastTab: function ($tabToOutcast) {
			let $succeedingTab = this._dom.$outcastTabsUL.f('li').eq($tabToOutcast.data('initial-order') || 0);
			$tabToOutcast.addClass(_outcast_tab_classes).removeClass(_revealed_tab_classes);
			if ($succeedingTab.exists()) {
				$succeedingTab.before($tabToOutcast);
			} else { // Last, no succeeding elem
				this._dom.$outcastTabsUL.append($tabToOutcast);
			}
		},

		_revealTab: function ($tabToReveal, $lastRevealed) {
			$tabToReveal.addClass(_revealed_tab_classes).removeClass(_outcast_tab_classes);
			$lastRevealed.before($tabToReveal);
		},

		updateRevealedTabsDOMRef: function () {
			this._dom.$revealedTabs = this._getRevealedTabs(this._dom.$revealedTabsUL);
		},

		_updateOutcastTabsDOMRef: function () {
			this._dom.$outcastTabs = this._dom.$innerWrapper.find('.mini-popup-content ul>li');
		},

		_bindTabClick: function ($tabsToBind, unbind) {
			if (!unbind) {
				$tabsToBind.on('click.outcastClick', this._tabClick.bind(this));
			} else {
				$tabsToBind.off('click.outcastClick');
			}
		},

		_getRevealedTabs: function ($revealedTabsUL) {
			return $revealedTabsUL.find('>li:not(.hide, .show-more-tabs, .only-mobile)');
		},

		_initDOMRefs: function ($tabsWrapper) {
			let $innerWrapper = $tabsWrapper,
				$outcastTabsUL = $innerWrapper.find('.mini-popup-content ul'),
				$revealedTabsUL = $tabsWrapper.find('ul.button-tabs-list'),
				$revealedTabs = this._getRevealedTabs($revealedTabsUL),
				$outcastTabs = this._outcastTabs($revealedTabs, $innerWrapper);

			this._dom = {$innerWrapper, $revealedTabsUL, $revealedTabs, $outcastTabsUL, $outcastTabs};
		},

		_initSortability: function () {
			// this._dom.$revealedTabsUL.sortable({
			// 	axis: 'x',
			// 	items : 'li',
			// 	cancel: '', // So <button>s could be handles (45 minutes burnt ^^)
			// 	stop: () => {
			// 		this.updateRevealedTabsDOMRef();
			// 	}
			// });
			// this._dom.$outcastTabsUL.sortable({
			// 	axis: 'y',
			// 	items : 'li',
			// 	cancel: '',
			// 	stop: () => {
			// 		this._updateOutcastTabsDOMRef();
			// 		this._enumerateTabs();
			// 	}
			// });

			new SortableList(this._dom.$outcastTabsUL[0], {
				hoverStyleHack: true,
				onEndHandler: () => {
					this._updateOutcastTabsDOMRef();
					this._enumerateTabs();
				}
			})
		},

		_enumerateTabs: function () {
			this._dom.$revealedTabs.last().removeData('initial-order');
			_.e(this._dom.$outcastTabs, (tab, orderId) => $(tab).data('initial-order', orderId));
		},

		_getControls: function () {
			let $result;
			if (this._prerendered) {
				$result = this._dom.$innerWrapper.find('.show-more-tabs');
			} else {
				$result = $('<div class="clip-controls"><span class="show-more">...</span><div class="more-tabs displayNone"></div></div>');
			}
			return $result;
		},

		_tabClick: function (e) {
			this._switchToTab($(e.currentTarget));
		}
	})
});
