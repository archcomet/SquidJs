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
            this.modelList = this.engine.createModelList('playerControl', {
                input: 'InputComponent',
                steering: 'SteeringComponent',
                position: 'PositionComponent'
            });
            this.mouseData = {};
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('mouseUpdate', this);
            this.engine.bindEvent('playerControlAdded', this);
            return this;
        };

        CreatureControlSystem.prototype.deinit = function () {
            this.engine.unbindEvent('playerControlAdded', this);
            this.engine.unbindEvent('mouseUpdate', this);
            this.engine.unbindEvent('update', this);
            this.engine.destroyModelList(this.modelList.name);
        };

        CreatureControlSystem.prototype.playerControlAdded = function (model) {
            var steering, position;
            steering = model.steering;
            steering.behavior = 'seek';

            position = model.position;
            steering.target.x = position.x;
            steering.target.y = position.y;
            steering.sprinting = false;
            steering.drift = true;
        };

        CreatureControlSystem.prototype.update = function () {
            var i, n, models = this.modelList.models;
            for (i = 0, n = models.length; i < n; i++) {
                this.updateModel(models[i]);
            }
        };

        CreatureControlSystem.prototype.mouseUpdate = function (mouseData) {
            this.mouseData = mouseData;
        };

        CreatureControlSystem.prototype.updateModel = function (model) {
            var steering, position, offset;
            steering = model.steering;
            offset = this.engine.canvas.getOffset();

            if (this.mouseData.active) {
                steering.behavior = 'seek';
                steering.target.x = this.mouseData.position.x + offset.x;
                steering.target.y = this.mouseData.position.y + offset.y;
                steering.sprinting = this.mouseData.leftDown;
                steering.drift = false;
            } else {
                position = model.position;
                steering.behavior = 'approach';
                steering.target.x = position.x;
                steering.target.y = position.y;
                steering.sprinting = false;
                steering.drift = true;
            }
        };

        return CreatureControlSystem;

    }());

}(window));