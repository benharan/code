/**
 * Created by Skeksify on 09/07/2016.
 */

define(["Modules/Mutators/GeneralMutator", "Modules/Mutators/UnderscoreMutator", "Modules/Mutators/jQueryMutator", "Modules/Mutators/BackboneMutator"], function () {
    requirejs(["app/investing"], investingApp => investingApp.init());
});
