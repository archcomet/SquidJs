(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.SteeringComponent = (function () {

        /**
         * SteeringComponent
         * Provides steering behavior data to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function SteeringComponent(options) {
            return SteeringComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, SteeringComponent);

        SteeringComponent.prototype.init = function (options) {
            _.defaults(this, options, {
                maxVelocity: 7,
                maxForce: 450,
                sprinting: false,
                sprintMultiplier: 3,
                floatDistance: 3,
                behavior: undefined,
                target: {
                    x: 0,
                    y: 0
                },
                targetDistance: 0.5
            });
            return this;
        };

        return SteeringComponent;

    }());

}(window));