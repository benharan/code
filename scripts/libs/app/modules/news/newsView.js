/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/toolset",
    "text!./news.html",
    "text!./news.css"
], function (_, $, Backbone, Displayable, Toolset, html, css) {
    function beautifyTitle(title) {
        return title.split('-').map(Toolset.Texts.capitalizeWord).slice(0, -1).join(' ');
    }

    return Displayable.extend({

        _titleMap: {
            'nq-100-futures': 'Nasdaq Futures',
            'us-spx-500-futures': 'S&P 500 Futures',
            'us-30': 'Dow 30',
            'smallcap-2000': 'SmallCap 2000',
            'volatility-s-p-500': 'S&P 500 VIX',
            'germany-30': 'DAX',
            '': ''

        },

        _markupScheme: {
            'image': '.news-img'
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function (category, title) {
            Displayable.prototype.render.call(this, this._chewTemplateData(category, title), this._markupScheme);
			window.prerenderReady = false;
			let loopLimit = 5,
                appendToImage = () => this._dom.image.after(loopLimit + '<br/>'),
                loop = function () {
                    setTimeout(function () {
                        appendToImage();
                        if (loopLimit--) {
                            loop();
						} else {
							window.prerenderReady = true;
                        }
                    }, 1000)
                }

            loop();

            return this.$el;
        },

        _chewTemplateData: function (category, title) {
            return {
                title: beautifyTitle(title)
            }
        }
    })
});
