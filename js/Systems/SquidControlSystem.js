(function (global) {
    "use strict";

    global.app = global.app || {};

    global.app.System.SquidControlSystem = (function () {

        /**
         * SquidControlSystem
         * @param engine
         * @return {SquidControlSystem}
         * @constructor
         */

        function SquidControlSystem(engine) {
            return SquidControlSystem.alloc(this, arguments);
        }

        app.inherit(app.System, SquidControlSystem);

        SquidControlSystem.prototype.init = function () {
            this.mouseData = {};
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('mouseUpdate', this);
            return this;
        };

        SquidControlSystem.prototype.deinit = function () {
            this.engine.unbindEvent('mouseUpdate', this);
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('update', this);
        };

        /*** Update Event ***/

        SquidControlSystem.prototype.update = function () {
            var i, n, steering, position,
                offset = this.engine.canvas.getOffset(),
                entityArray = this.engine.entitiesForComponent('InputComponent');

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                steering = entityArray[i].SteeringComponent;

                if (this.mouseData.active) {
                    steering.behavior = 'seek';
                    steering.target.x = this.mouseData.position.x + offset.x;
                    steering.target.y = this.mouseData.position.y + offset.y;
                    steering.sprinting = this.mouseData.leftDown;
                    steering.drift = false;
                } else {
                    position = entityArray[i].PositionComponent;
                    steering.behavior = 'approach';
                    steering.target.x = position.x;
                    steering.target.y = position.y;
                    steering.sprinting = false;
                    steering.drift = true;
                }
            }
        };

        /*** Mouse Event ***/

        SquidControlSystem.prototype.mouseUpdate = function (mouseData) {
            this.mouseData = mouseData;
        };

        /*** Entity Event ***/

        SquidControlSystem.prototype.entityAdded = function (entity) {
            if (entity.InputComponent !== undefined) {
                var steering = entity.SteeringComponent,
                    position = entity.PositionComponent;

                steering.behavior = 'seek';
                steering.target.x = position.x;
                steering.target.y = position.y;
                steering.sprinting = false;
                steering.drift = true;
            }
        };

        return SquidControlSystem;

    }());

}(window));