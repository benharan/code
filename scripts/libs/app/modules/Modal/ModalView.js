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
			"click .close-modal": "exit",
			"click .modal-overlay": "exit"
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

		setup: function (settings) {
        	if (settings.title && settings.$content) {
        		this.setContent(settings.title, settings.$content);
			}

			this._onExit = settings.onExit;

			settings.show && this.show();
		},

		setContent: function (title, $content) {
        	if (title.isnt(this._lastTitle)) {
				this._dom.title.text(title);
				this._dom.content.html($content);
				this._lastTitle = title;
			}
			return this;
		},

        show: function () {
            this.$el._show();

			return this;
		},

		exit: function () {
            this.$el._hide();

			this._onExit && this._onExit();

			return this;
		}
    })
});
