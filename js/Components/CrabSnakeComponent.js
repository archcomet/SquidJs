(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.CrabSnakeComponent = (function () {

        /**
         * CrabSnakeComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function CrabSnakeComponent(options) {
            return CrabSnakeComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, CrabSnakeComponent);

        CrabSnakeComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                radius: 10
            });

            return this;
        };

        return CrabSnakeComponent;

    }());

}(window));