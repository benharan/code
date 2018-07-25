/**
 * Created by Skeksify on 09/07/2016.
 */

window.cl = window.lcl = window.throwError = window.announceWarn = function(){};

// {{ Dev Only Code {{
window.cl = console.log;
window.lcl = (...args) => {
    if (window.lcl.flag) {
        cl(...args);
        window.lcl.customCL(...args);
    }
}

window.lcl.flag = localStorage.getItem('consolePrints') === '1';
window.lcl.customCL = ()=>1;

console.clear();

function getIfNotProd(fu) {
	if ('Not Production') {
		return fu;
	} else {
		return $.noop;
	}
}

// Todo: Extract to 'window' mutator
window.throwError = getIfNotProd(function (mainLabel) {
	var i, finalStrArr = ['__ Runtime Error: ' + mainLabel];
	for (i = 1; i < arguments.length; i++) {
		i === 1 && finalStrArr.push(' [');
		finalStrArr.push(arguments[i] + (i !== arguments.length - 1 ? ', ' : ''));
		i === arguments.length - 1 && finalStrArr.push(']');
	}
	throw new Error(finalStrArr.join(''))
})

window.announceWarn = getIfNotProd(function (mainLabel) {
	var i, finalStrArr = ['__ Runtime Warning: ' + mainLabel];
	for (i = 1; i < arguments.length; i++) {
		i === 1 && finalStrArr.push(' [');
		finalStrArr.push(arguments[i] + (i !== arguments.length - 1 ? ', ' : ''));
		i === arguments.length - 1 && finalStrArr.push(']');
	}
	console.warn(finalStrArr.join(''));
})

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
        	hash: function djb2Code(str){
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
