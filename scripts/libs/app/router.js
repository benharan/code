/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Modules/mainFrame/mainFrame"
], function (_, $, Backbone) {
    var debug = function() { if (1) debugger; };

    return Backbone.Model.extend({
        _dispatchNavigation: function (schemeNav, section, p1, p2) {
            this.trigger('navigation', schemeNav, section, p1, p2);
        },

        initialize: function () {
            var RouterClass = Backbone.Router.extend({
                routes: {
                    '': 'index',
                    'news/:category/:article': 'news',
                    'indices/major-indices(-:inner)': 'm_indices',
                    'indices/:instrument': 'indices',
                    'equities/:instrument': 'equities',
                    'portfolio/(:pId)': 'portfolio'
                },
                index: () => this._dispatchNavigation(false, 'index'),
                news: (category, article) => this._dispatchNavigation(false, 'news', category, article),
                indices: (indices) => this._dispatchNavigation(true, 'indices', indices),
                m_indices: (inner) => this._dispatchNavigation(true, 'major-indices', inner),
				equities: (equities) => this._dispatchNavigation(true, 'equities', equities),
                portfolio: (portfolioId) => this._dispatchNavigation(false, 'portfolio', portfolioId)
            });

            window.InvestingApp.Router = new RouterClass();

			// window.InvestingApp.Router.on('route', () => {debugger;});

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + window.InvestingApp.root;

                if (href.prop.slice(0, root.length) === root) { // Inner link
                    evt.preventDefault();
                    window.InvestingApp.Router.navigate(href.attr, { trigger: true });
                }
            });
            return this;
        }
    })
});
