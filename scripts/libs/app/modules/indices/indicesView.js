/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable"
], function (_, $, Backbone, Displayable, html, css) {
    return Displayable.extend({

        _instrumentTitleMap: {
            'nq-100-futures': 'Nasdaq Futures',
            'us-spx-500-futures': 'S&P 500 Futures',
            'us-30': 'Dow 30',
            'smallcap-2000': 'SmallCap 2000',
            'volatility-s-p-500': 'S&P 500 VIX',
            'germany-30': 'DAX',
            '': ''

        },

        _markupScheme: {
            "spans": "span"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'indices', 'indices', true);

        },

        render: function (instrument) {
            Displayable.prototype.render.call(this, this._chewTemplateData(instrument), this._markupScheme);

            this._dom.spans.css('font-size', '30px');

            return this.$el;
        },

        _chewTemplateData: function (instrument) {
            return {
                instrument: this._instrumentTitleMap[instrument]
            }
        }
    })
});
