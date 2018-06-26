/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	let incId = 1,
		domAttachmentWatchers = {},
		EventBus = Backbone.Model.extend({
			onceAttachedToDOM: function ($elemToMonitor, cb) {
				domAttachmentWatchers[incId++] = { $elemToMonitor, cb };
			}
		}),
		EventBusInstance = new EventBus();

	EventBusInstance.on('mainFrameInsertion', ($elemInjected) => {
		_.each(domAttachmentWatchers, (watcher, i) => {
			if (watcher.$elemToMonitor.isChildOf($elemInjected) || watcher.$elemToMonitor === $elemInjected) {
				watcher.cb();
				delete domAttachmentWatchers[i]; // Always Once (heh) need optionality?
			}
		})
	})

	return EventBusInstance;
});
