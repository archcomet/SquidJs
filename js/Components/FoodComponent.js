(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.FoodComponent = (function () {

        /**
         * FoodComponent
         * @param options
         * @return {*}
         * @constructor
         */

        function FoodComponent(options) {
            return FoodComponent.alloc(this, arguments);
        }

        app.inherit(app.Component, FoodComponent);

        FoodComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                radius: 7,
                duration: 900, // frames
                collectedBy: undefined
            });

            return this;
        };

        return FoodComponent;

    }());

}(window));