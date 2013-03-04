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
                maxForwardVelocity: 0,
                maxSteeringVelocity: 7,
                maxAngularVelocity: 0,
                maxForwardThrust: 0,
                maxSteeringForce: 450,
                maxTorque: 0,
                sprinting: false,
                sprintMultiplier: 2,
                behavior: undefined,
                target: {
                    x: 0,
                    y: 0
                },
                targetVector: {
                    x: 0,
                    y: 0
                }
            });
            return this;
        };

        return SteeringComponent;

    }());

}(window));