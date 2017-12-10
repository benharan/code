/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "./models/frame/frame"
], function (_, $, Backbone, Utils, Frame) {
    var game = Backbone.Model.extend({

        start: function () {
            let main_frame = new Frame();
            $('body').append(main_frame.render());
        }
    });
    
    return new game()
});