(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.RockComponent = (function () {

        /**
         * RockComponent
         * Provides coral properties to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function RockComponent(options) {
            return RockComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, RockComponent);

        RockComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                vertices: []
            });

            return this;
        };

        return RockComponent;

    }());

}(window));