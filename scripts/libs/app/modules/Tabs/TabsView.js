/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/TabScrollability/TabScrollability",
	"Modules/TabClipping/TabClipping",
	"Modules/SortableList/SortableList",
    "text!./Tabs.html",
    "text!./Tabs.css"
], function (_, $, Backbone, Displayable, TabScrollability, TabClipping, SortableList, html, css) {
    return Displayable.extend({

        _settings: null,
        _tabClipper: null,

        _markupScheme: {
            ul: 'ul'
        },

        initialize: function (settings) {
			if (settings.$tabsWrapper) {
				Displayable.prototype.initialize.call(this, settings.$tabsWrapper, css, true);
				this._prerendered = true;
			} else {
				Displayable.prototype.initialize.call(this, html, css);
			}
            this._settings = settings;
        },

        render: function ($tabs) {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			if (!this._prerendered) {
				this._dom.ul.html($tabs);
			}

            if (this._settings.scrollability) {
				this._initializeTabScrollability();
			} else if (this._settings.clip) {
				this._initializeTabClipping();
			}

			this._initializeTabSortability();

			this.$el.find('.create-new').on('click', () => this.trigger('createNewView'));
            return this.$el;
        },

		_initializeTabClipping: function () {
			if (this._prerendered) {
				this._tabClipper = new TabClipping(this.$el, true);
			} else { // Sending undefined var changes to {}
				this._tabClipper = new TabClipping(this.$el);
			}
			this.$el.addClass('clip');
		},

		_initializeTabSortability: function () {
			const _list_length = this._dom.ul.f('li').length + 1;

			new SortableList(this._dom.ul[0], {
				filter: '.show-more-tabs',
				itemIndexBoundary: _list_length,
				onEndHandler: () => {
					this._tabClipper.updateRevealedTabsDOMRef();
				}
			})
		},

		_initializeTabScrollability: function () {
			new TabScrollability(this.$el);
			this.$el.addClass('scrollability');
		},

        closeTabClipper: function () {
			this._tabClipper && this._tabClipper.closeDialog();
		}
    })
});
