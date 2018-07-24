/**
 * Created by Skeksify on 09/07/2016.
 */

define(["Modules/Mutators/underscoreMutator", "Modules/Mutators/jQueryMutator", "Modules/Mutators/backboneMutator"], function () {
    requirejs(["app/investing"], investingApp => investingApp.init());
});
