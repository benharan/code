/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable"
], function (_, $, Backbone, Displayable) {
    return Displayable.extend({

        events: {
			"click .close-modal": "hide",
			"click .modal-overlay": "hide"
        },

        _markupScheme: {
            "title": ".modal-title-wrapper h2",
            "content": ".modal-content"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, '[data-section="modal"]', 'modal', true);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		setContent: function (title, $content) {
			this._dom.title.text(title);
			this._dom.content.html($content);

			return this;
		},

        show: function () {
            this.$el._show();

			return this;
		},

        hide: function () {
            this.$el._hide();

			return this;
		}
    })
});
