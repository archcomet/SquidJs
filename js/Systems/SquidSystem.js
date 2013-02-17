(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.SquidSystem = (function () {

        /**
         * SquidSystem
         * @param engine
         * @return {SquidSystem}
         * @constructor
         */

        function SquidSystem(engine) {
            return SquidSystem.alloc(this, arguments);
        }

        app.inherit(app.System, SquidSystem);

        SquidSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
        };

        SquidSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        /*** Update Event ***/

        SquidSystem.prototype.update = function () {
            var i, n, entityArray = this.engine.entitiesForComponent('SquidComponent');
            for (i = 0, n = entityArray.length; i < n; i += 1) {
                this.updateSquid(entityArray[i]);
            }
        };

        SquidSystem.prototype.updateSquid = function (entity) {
            var target, vec, maxOffset,
                position = entity.PositionComponent,
                steering = entity.SteeringComponent,
                body = entity.SquidComponent;

            if (steering.drift) {
                vec = new b2.Vec2(0, 0);
            } else {
                target = steering.target;
                vec = new b2.Vec2(
                    target.x - position.x,
                    target.y - position.y
                );

                maxOffset = body.irisRadius * 0.45;
                if (vec.Length() > maxOffset) {
                    vec.Normalize();
                    vec.Multiply(maxOffset);
                }
            }

            body.irisPosition = {
                x: vec.x,
                y: vec.y
            };
        };

        return SquidSystem;

    }());

}(window));