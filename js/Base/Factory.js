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

        Factory.prototype.init = function () {
            this.entities = [];
            this.settings = {
                spawn: this.debugSpawn.bind(this),
                despawn: this.debugDespawn.bind(this)
            };
        };

        Factory.prototype.createEntity = function (options) {
            var entity = new app.Entity(options);
            this.entities.push(entity);
            return entity;
        };

        Factory.prototype.destroyEntity = function (entity) {
            var i, n;
            for (i = 0, n = this.entities.length; i < n; i += 1) {
                if (this.entities[i] === entity) {
                    this.entities.splice(i, 1);
                    entity.destroy();
                    return;
                }
            }
        };

        Factory.prototype.spawn = function (options) {
            return undefined;
        };

        Factory.prototype.despawn = function (entity) {
            this.engine.removeEntity(entity);
            this.destroyEntity(entity);
        };

        Factory.prototype.debugSpawn = function () {
            var center = this.engine.systems.CameraSystem.position,
                canvas = this.engine.canvas;

            this.spawn({
                x: app.random(center.x - canvas.width / 2, center.x + canvas.width / 2),
                y: app.random(center.y - canvas.height / 2, center.y + canvas.height / 2)
            });
        };

        Factory.prototype.debugDespawn = function () {
            var n = this.entities.length;
            this.despawn(this.entities[n - 1]);
        };

        return Factory;

    }());

}(window));