/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "./models/mainFrame/mainFrame"
], function (_, $, Backbone) {
    var debug = function() { debugger; },
        router = Backbone.Model.extend({

        _routes: {
            routes: {
                '': 'index',
                'news/:param': 'news',
                'news/economy-news/:param': 'news2',
                'news:param': 'news3',
                '/:param': 'news4'
            },
            index: function(){
                this.trigger('navigation', 'index');
                debug();
            },
            news: function(e){
                this.trigger('navigation', 'news', e);
                debug();
            },
            news2: function() { debug.apply(null, arguments) },
            news3: function() { debug.apply(null, arguments) },
            news4: function() { debug.apply(null, arguments) }
        },

        init: function () {
            window.App.Router = Backbone.Router.extend(this._routes);

            new window.App.Router;

            Backbone.history.start({
                pushState: true,
                root: window.App.root
            });

            $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") },
                    root = location.protocol + "//" + location.host + App.root;

                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    // Stop the default event to ensure the link will not cause a page
                    // refresh.
                    evt.preventDefault(); console.log('Prevented - ', href.attr);

                    // `Backbone.history.navigate` is sufficient for all Routers and will
                    // trigger the correct events. The Router's internal `navigate` method
                    // calls this anyways.  The fragment is sliced from the root.
                    Backbone.history.navigate(href.attr, true);
                }
            });
            return this;
        }
    });

    return new router()
});
