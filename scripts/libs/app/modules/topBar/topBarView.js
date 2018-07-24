/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "EventBus",
    "Displayable"
], function (_, $, Backbone, EventBus, Displayable) {
    return Displayable.extend({

        events: { },

        _markupScheme: {
            "loggedUser": ".js-logged-username"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'topBar', 'topBar', true);

			EventBus.on('login', this._setLoggedUser.bind(this))
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		_setLoggedUser: function (username) {
			this._dom.loggedUser.text(username);
		}
    })
});
