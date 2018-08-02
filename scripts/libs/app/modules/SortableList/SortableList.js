/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"External/Sortable"
], function (_, $, Backbone, Sortable) {
	return Backbone.Model.extend({
		initialize: function (listWrapper, moreSettings) {
			let lastX = -1,
				lastY = -1,
				lastTime = 0,
				boundary = _.valueOr(moreSettings.itemIndexBoundary, -1),
				onMove = function (event, originalEvent) {
					let now = (new Date()).getTime();
					if (
						(originalEvent.clientX === lastX && originalEvent.clientY === lastY) // Mouse moved
						|| (~boundary && Sortable.utils.index(event.related, 'li') === boundary) // Within boundary
						|| (now - lastTime < 100) // Throttling
						|| !originalEvent.fromElement // Lucky strike
					) {
						return false;
					}
					// lcl(originalEvent.fromElement);
					// lcl(originalEvent.clientX, originalEvent.clientY, Math.random())
					lastX = originalEvent.clientX;
					lastY = originalEvent.clientY;
					lastTime = now;
				},
				$listItems = $(listWrapper).f('li');

			new Sortable(listWrapper, _.extend({
				onMove,
				onStart: function () {
					moreSettings.hoverStyleHack && $listItems.rCl('free');
				},
				onEnd: function (event) {
					moreSettings.hoverStyleHack && $listItems.aCl('free');
					_.tryRun(moreSettings.onEndHandler, event);
				},
				animation: 200,
				draggable: 'li',
				touchStartThreshold: 4,
			}, moreSettings));
		}
	})
});
