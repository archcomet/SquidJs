(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSystem = (function () {

        /**
         * RockSystem
         * @return {RockSystem}
         * @constructor
         */

        function RockSystem(engine) {
            return RockSystem.alloc(this, arguments);
        }

        app.inherit(app.System, RockSystem);

        RockSystem.prototype.init = function () {
            this.settings = {
                forceToDamage: 5,
                impactDistance: 5,
                fragmentRadiusLimit: 15,
                fragmentCount: 3,
                fragmentImpulseMultiplier: 0.5,
                foodSpawnRate: 0.2,
                minFoodImpulse: 1,
                maxFoodImpulse: 3
            };

            this.engine.bindEvent('update', this);
            return this;
        };

        RockSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        /*** Update Event ***/

        RockSystem.prototype.update = function (dt) {
            var i, n, entity,
                entityArray = this.engine.entitiesForComponent('RockComponent'),
                rocksDestroyed = [];

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                entity = entityArray[i];

                if (entity.HealthComponent.health <= 0) {
                    rocksDestroyed.push(entity.id);
                }
            }

            for (i = 0, n = rocksDestroyed.length; i < n; i += 1) {
                entity = this.engine.entities[rocksDestroyed[i]];
                this.destroyRock(entity);
            }
        };

        RockSystem.prototype.destroyRock = function (entity) {
            var i, n, fragment, food, rads, step, impulse, impulseNormal, body,
                minRadius = entity.RockComponent.minRadius,
                maxRadius = entity.RockComponent.maxRadius,
                rockFactory = this.engine.factories.RockFactory;

            if (minRadius > this.settings.fragmentRadiusLimit) {
                rads = Math.PI * 2 / 3;
                step = app.random(0, rads);

                for (i = 0, n = this.settings.fragmentCount; i < n; i += 1) {
                    fragment = rockFactory.spawn({
                        x: entity.PositionComponent.x,
                        y: entity.PositionComponent.y,
                        maxHealth: entity.HealthComponent.maxHealth / 2,
                        vertexCount: 9,
                        minRadius: minRadius / 2,
                        maxRadius: maxRadius / 2
                    });

                    impulseNormal = entity.HealthComponent.lastDamage * this.settings.fragmentImpulseMultiplier;
                    impulse = {
                        x: Math.cos(step) * impulseNormal,
                        y: Math.sin(step) * impulseNormal
                    };

                    body = fragment.PhysicsComponent.body;
                    body.ApplyImpulse(impulse, body.GetWorldCenter());
                    step += rads;
                }
            }

            if (app.random(0, 1) < this.settings.foodSpawnRate) {
                food = this.engine.factories.FoodFactory.spawn({
                    x: entity.PositionComponent.x,
                    y: entity.PositionComponent.y
                });

                rads = app.random(0, Math.PI * 2);
                impulseNormal = app.random(
                    this.settings.minFoodImpulse,
                    this.settings.maxFoodImpulse
                );
                impulse = {
                    x: Math.cos(rads) * impulseNormal,
                    y: Math.sin(rads) * impulseNormal
                };

                body = food.PhysicsComponent.body;
                body.ApplyImpulse(impulse, body.GetWorldCenter());
            }

            rockFactory.despawn(entity);
        };

        return RockSystem;

    }());

}(window));