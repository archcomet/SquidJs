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
            this.allowControl = false;
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('mouseUpdate', this);
            this.engine.bindEvent('stageStart', this);
            this.engine.bindEvent('stageEnd', this);
            return this;
        };

        SquidControlSystem.prototype.deinit = function () {
            this.engine.unbindEvent('mouseUpdate', this);
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('stageStart', this);
            this.engine.unbindEvent('stageEnd', this);
        };

        /*** Events ***/

        SquidControlSystem.prototype.stageStart = function () {
            this.allowControl = true;
        };

        SquidControlSystem.prototype.stageEnd = function () {
            this.allowControl = false;
        };

        SquidControlSystem.prototype.update = function () {
            var i, n, steering, position,
                offset = this.engine.canvas.getOffset(),
                entityArray = this.engine.entitiesForComponent('SquidPlayerComponent');

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                steering = entityArray[i].SteeringComponent;

                if (this.mouseData.active && this.allowControl) {
                    steering.behavior = 'seek';
                    steering.target.x = this.mouseData.position.x + offset.x;
                    steering.target.y = this.mouseData.position.y + offset.y;
                    steering.sprinting = this.mouseData.leftDown;
                } else {
                    position = entityArray[i].PositionComponent;
                    steering.behavior = 'approach';
                    steering.target.x = position.x;
                    steering.target.y = position.y;
                    steering.sprinting = false;
                }

                entityArray[i].SquidComponent.lookAt = steering.target;
            }
        };

        /*** Mouse Event ***/

        SquidControlSystem.prototype.mouseUpdate = function (mouseData) {
            this.mouseData = mouseData;
        };

        return SquidControlSystem;

    }());

}(window));