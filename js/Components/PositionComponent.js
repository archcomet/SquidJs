(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.PositionComponent = (function () {

        /**
         * PositionComponent
         * Provides position data to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function PositionComponent(options) {
            return PositionComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, PositionComponent);

        PositionComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0,
                angle: 0,
                zOrder: 0
            });
            return this;
        };

        return PositionComponent;

    }());

}(window));