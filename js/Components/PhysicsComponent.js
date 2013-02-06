(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Component.PhysicsComponent = (function () {

        /**
         * PhysicsComponent
         * Provides physics properties to Entity
         * @param options
         * @return {*}
         * @constructor
         */

        function PhysicsComponent(options) {
            return PhysicsComponent.alloc(this, arguments);
        }
        app.inherit(app.Component, PhysicsComponent);

        PhysicsComponent.prototype.init = function (options) {
            var key;
            this.drag = options.drag;
            this.oceanBound = (options.oceanBound !== undefined) ? options.oceanBound : true;
            this.outOfWater = false;
            this.bodyDef = new b2.BodyDef();
            if (options.bodyDef) {
                for (key in options.bodyDef) {
                    if (options.bodyDef.hasOwnProperty(key)) {
                        this.bodyDef[key] = options.bodyDef[key];
                    }
                }
            }

            this.fixtureDef = new b2.FixtureDef();
            if (options.fixtureDef) {
                for (key in options.fixtureDef) {
                    if (options.fixtureDef.hasOwnProperty(key)) {
                        this.fixtureDef[key] = options.fixtureDef[key];
                    }
                }
            }
            return this;
        };

        return PhysicsComponent;

    }());

}(window));