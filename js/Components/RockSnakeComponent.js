(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.RockSnakeComponent = (function () {

        /**
         * RockSnakeComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function RockSnakeComponent(options) {
            return RockSnakeComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, RockSnakeComponent);

        RockSnakeComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                radius: 10
            });

            return this;
        };

        return RockSnakeComponent;

    }());

}(window));