(function (global) {
    "use strict";

    global.app = global.app || {};

    global.app.System.CreatureControlSystem = (function () {

        /**
         * PlayerControlSystem
         * @param engine
         * @return {*}
         * @constructor
         */
        function CreatureControlSystem(engine) {
            return CreatureControlSystem.alloc(this, arguments);
        }
        app.inherit(app.System, CreatureControlSystem);

        /*** Public Methods ***/

        CreatureControlSystem.prototype.init = function () {
            this.createModel(['InputComponent', 'SteeringComponent', 'PositionComponent'], this.entityAdded);
            this.mouseData = {};
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('mouseUpdate', this);
            return this;
        };

        CreatureControlSystem.prototype.deinit = function () {
            this.engine.unbindEvent('mouseUpdate', this);
            this.engine.unbindEvent('update', this);
            this.destroyModel();
        };

        CreatureControlSystem.prototype.entityAdded = function (entity) {
            var steering = entity.SteeringComponent,
                position = entity.PositionComponent;

            steering.behavior = 'seek';
            steering.target.x = position.x;
            steering.target.y = position.y;
            steering.sprinting = false;
            steering.drift = true;
        };

        CreatureControlSystem.prototype.update = function () {
            var i, n, steering, position,
                offset = this.engine.canvas.getOffset(),
                entities = this.model.entities;

            for (i = 0, n = entities.length; i < n; i++) {
                steering = entities[i].SteeringComponent;

                if (this.mouseData.active) {
                    steering.behavior = 'seek';
                    steering.target.x = this.mouseData.position.x + offset.x;
                    steering.target.y = this.mouseData.position.y + offset.y;
                    steering.sprinting = this.mouseData.leftDown;
                    steering.drift = false;
                } else {
                    position = entities[i].PositionComponent;
                    steering.behavior = 'approach';
                    steering.target.x = position.x;
                    steering.target.y = position.y;
                    steering.sprinting = false;
                    steering.drift = true;
                }
            }
        };

        CreatureControlSystem.prototype.mouseUpdate = function (mouseData) {
            this.mouseData = mouseData;
        };

        return CreatureControlSystem;

    }());

}(window));