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

		_onOk: null,
		_onExit: null,

        events: {
			"click .close-modal": "exit",
			"click .modal-overlay": "exit",
			"click .modal-button-cancel": "exit",
			"click .modal-button-ok": "_buttonOk",
        },

        _markupScheme: {
            "title": ".modal-title-wrapper h1",
            "content": ".modal-content",
			"modalButtons": ".modal-buttons",
			"modalButtonOk": ".modal-button-ok",
			"modalButtonCancel": ".modal-button-cancel",
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

			this._dom.modalButtons._toggleShow(settings.type && settings.type.is('okCancel'));

			this._onOk = settings.onOk;
			this._onExit = settings.onExit;

			settings.show !== false && this.show();
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

			_.tryRun(this._onExit);

			return this;
		},

		_buttonOk: function () {
			_.tryRun(this._onOk);

			return this.exit();
		}
    })
});
