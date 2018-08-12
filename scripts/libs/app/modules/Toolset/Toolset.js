/**
 * Created by Skeksify on 09/07/2016.
 */

window.cl = window.lcl = function(){ };
// window.throwError = window.announceWarn = function(){ debugger; };

// {{ Dev Only Code {{
window.cl = console.log;
window.lcl = (...args) => {
    if (window.lcl.flag) {
        cl(...args);
        window.lcl.customCL(...args);
    }
}

window.lcl.flag = ~["1", "⌐"].indexOf(localStorage.getItem('consolePrints'));
window.lcl.customCL = ()=>1;

// console.clear();
// }} Dev Only Code }}

define([
    "underscore",
    "jquery",
    "Backbone",
    "Toolset/Tools/math",
    "Toolset/Tools/FinancialData",
    "Toolset/Tools/texts",
    "Toolset/Tools/is",
    "Toolset/Tools/DeepMap",
    "Toolset/Tools/ClientStorage",
    "Toolset/Tools/ClientSettings",
	"Modules/Modal/ModalView"
], function (_, $, Backbone, MathTool, FinancialData, TextsTool, IsTool, DeepMap, ClientStorage, ClientSettings, ModalView) {
	let modalView = new ModalView(),
		Toolset = Backbone.Model.extend({
        initialize: function () {
			modalView.render();
        },
        Math: new MathTool(),
		FinancialData: new FinancialData(),
        Texts: new TextsTool(),
        is: new IsTool(),
        DeepMap,
		Modal: modalView,
		ClientStorage: new ClientStorage(true, true),
		ClientSettings: new ClientSettings(),
		Compression: LZString,
        miscFuncs: {
        	hash: function (str){
				var hash = 5381, char;
				for (var i = 0; i < str.length; i++) {
					char = str.charCodeAt(i);
					hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
				}
				return ''+hash;
			},
            p: function (func, context, params) {
                return params ? func.bind(context, params) : func.bind(context);
            },
            pAr: function (func, context, params) {
                return params ? func.bind.apply(func, [context].concat(params)) : func.bind(context);
            }
        }
    });


    return new Toolset();
});
