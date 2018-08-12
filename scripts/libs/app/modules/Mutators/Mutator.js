/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
	let currentMutateeName;
    const Mutator = Backbone.Model.extend({
		initialize: function () { },

		mutate: function (mutatee, mutations, mutateeName) {
			currentMutateeName = mutateeName;
			mutations.forEach(mapping => this._applyFunction(mutatee, ...mapping));
		},

		_applyFunction: function(mutatee, fuNames, fu) {
			[].concat(fuNames).forEach((fuName) => {
				if (fuName) {
					if (mutatee[fuName]) {
						(window.throwError || console.error)(`${currentMutateeName} Mutation Exception`, `Function '${fuName}' already exists`);
					} else {
						mutatee[fuName] = fu;
					}
				}
			})
		}
	});

    return new Mutator();
});
