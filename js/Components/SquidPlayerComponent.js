(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.SquidPlayerComponent = (function () {

        /**
         * SquidPlayerComponent
         * Provides human input to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function SquidPlayerComponent(options) {
            return SquidPlayerComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, SquidPlayerComponent);

        SquidPlayerComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                respondToInput: true
            });
        };

        return SquidPlayerComponent;

    }());

}(window));