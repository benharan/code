/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "./models/mainFrame/mainFrame"
], function (_, $, Backbone, Utils, MainFrame) {
    var game = Backbone.Model.extend({

        init: function () {
            let main_frame = new MainFrame();
            $('body').append(main_frame.render());
        }
    });
    
    return new game()
});