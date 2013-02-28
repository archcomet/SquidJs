(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.RockSnakeAIComponent = (function () {

        /**
         * RockSnakeAIComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function RockSnakeAIComponent(options) {
            return RockSnakeAIComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, RockSnakeAIComponent);

        RockSnakeAIComponent.prototype.init = function (options) {
            _.defaults(this, options, {
            });

            return this;
        };

        return RockSnakeAIComponent;

    }());

}(window));