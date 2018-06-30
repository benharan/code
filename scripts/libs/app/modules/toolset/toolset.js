/**
 * Created by Skeksify on 09/07/2016.
 */

window.cl = console.log;
window.lcl = (...args) => {
    if (window.lcl.flag) {
        cl(...args);
        window.lcl.customCL(...args);
    }
}

window.lcl.flag = localStorage.getItem('consolePrints') === '1';
window.lcl.customCL = ()=>1;

define([
    "underscore",
    "jquery",
    "Backbone",
    "Toolset/toolsetUIView",
    "Toolset/tools/math",
    "Toolset/tools/FinancialData",
    "Toolset/tools/texts",
    "Toolset/tools/is",
    "Toolset/tools/DeepMap",
    "Toolset/tools/TemplateCompiler"
], function (_, $, Backbone, View, MathTool, FinancialData, TextsTool, IsTool, DeepMap, TemplateCompiler) {
    var Toolset = Backbone.Model.extend({
        initialize: function () {
            this._uiView = new View();

            $('body').append(this._uiView.render());
        },
        Math: new MathTool(),
		FinancialData: new FinancialData(),
        Texts: new TextsTool(),
        is: new IsTool(),
        DeepMap,
		TemplateCompiler,
        miscFuncs: {
            p: function (func, context, params) {
                return params ? func.bind(context, params) : func.bind(context);
            },
            pAr: function (func, context, params) {
                return params ? func.bind.apply(func, [context].concat(params)) : func.bind(context);
            }
        }
    });

    function getIfNotProd(fu) {
        if ('Not production') {
            return fu;
        } else {
            return $.noop;
        }
	}

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

    return new Toolset();
});
