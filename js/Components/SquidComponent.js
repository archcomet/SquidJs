(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.SquidComponent = (function () {

        /**
         * SquidComponent
         * Provides body shape data to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function SquidComponent(options) {
            return SquidComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, SquidComponent);

        SquidComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                radius: 10.0,
                thickness: 5.0,
                eyeRadius: 5.0,
                irisRadius: 2.0
            });
            return this;
        };

        return SquidComponent;

    }());

}(window));