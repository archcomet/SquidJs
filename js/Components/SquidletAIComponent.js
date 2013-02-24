(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.SquidletAIComponent = (function () {

        /**
         * SquidletAIComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function SquidletAIComponent(options) {
            return SquidletAIComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, SquidletAIComponent);

        SquidletAIComponent.prototype.init = function (options) {
            _.defaults(this, options, {
            });

            return this;
        };

        return SquidletAIComponent;

    }());

}(window));