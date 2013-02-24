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
                squid = entity.SquidComponent;

            target = squid.lookAt || {
                x: 0,
                y: 0
            };

            vec = new b2.Vec2(
                target.x - position.x,
                target.y - position.y
            );

            maxOffset = squid.irisRadius * 0.45;
            if (vec.Length() > maxOffset) {
                vec.Normalize();
                vec.Multiply(maxOffset);
            }

            squid.irisPosition = {
                x: vec.x,
                y: vec.y
            };
        };

        return SquidSystem;

    }());

}(window));