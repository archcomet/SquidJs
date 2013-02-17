(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory = (function () {

        /**
         * Factory
         * @return {*}
         * @constructor
         */

        function Factory(engine) {
            this.engine = engine;
            return Factory.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Factory);

        Factory.prototype.spawn = function (options) {
            return undefined;
        };

        Factory.prototype.despawn = function (entity) {
            this.engine.removeEntity(entity);
            entity.destroy();
        };

        Factory.prototype.debugSpawn = function () {
            var center = this.engine.systems.CameraSystem.position,
                canvas = this.engine.canvas;

            this.spawn({
                x: app.random(center.x - canvas.width / 2, center.x + canvas.width / 2),
                y: app.random(center.y - canvas.height / 2, center.y + canvas.height / 2)
            });
        };

        return Factory;

    }());

}(window));