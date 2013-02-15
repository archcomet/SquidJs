(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSystem = (function () {

        var settings = {
            minImpulseForDamage: 4,
            minRadiusForFragments: 15,
            numberOfFragments: 3,
            foodSpawnRate: 0.2,
            minFoodImpulse: 1,
            maxFoodImpulse: 4
        };

        /**
         * RockSystem
         * @return {*}
         * @constructor
         */

        function RockSystem(engine) {
            return RockSystem.alloc(this, arguments);
        }

        app.inherit(app.System, RockSystem);


        RockSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);
            return this;
        };

        RockSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);
            this.destroyModel();
        };

        RockSystem.prototype.update = function (dt) {
            var i, n, entity,
                entityArray = this.engine.entitiesForComponent('RockComponent'),
                rocksDestroyed = [];

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                entity = entityArray[i];
                if (entity.HealthComponent !== undefined && entity.HealthComponent.health <= 0) {
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
                rockFactory = this.engine.rockFactory;

            if (minRadius > settings.minRadiusForFragments) {
                rads = Math.PI * 2 / 3;
                step = app.random(0, rads);

                for (i = 0, n = settings.numberOfFragments; i < n; i += 1) {
                    fragment = rockFactory.createRock({
                        x: entity.PositionComponent.x,
                        y: entity.PositionComponent.y,
                        maxHealth: entity.HealthComponent.maxHealth / 2,
                        vertexCount: 9,
                        minRadius: minRadius / 2,
                        maxRadius: maxRadius / 2
                    });

                    impulseNormal = app.random(minRadius, maxRadius);
                    impulse = {
                        x: Math.cos(step) * impulseNormal,
                        y: Math.sin(step) * impulseNormal
                    };

                    body = fragment.PhysicsComponent.body;
                    body.ApplyImpulse(impulse, body.GetWorldCenter());
                    step += rads;
                }
            }

            if (app.random(0, 1) < settings.foodSpawnRate) {
                food = this.engine.foodFactory.createFood({
                    x: entity.PositionComponent.x,
                    y: entity.PositionComponent.y
                });

                rads = app.random(0, Math.PI * 2);
                impulseNormal = app.random(settings.minFoodImpulse, settings.maxFoodImpulse);
                impulse = {
                    x: Math.cos(rads) * impulseNormal,
                    y: Math.sin(rads) * impulseNormal
                };

                body = food.PhysicsComponent.body;
                body.ApplyImpulse(impulse, body.GetWorldCenter());
            }

            rockFactory.destroyRock(entity);
        };

        RockSystem.prototype.entityAdded = function (entity) {
            if (entity.RockComponent !== undefined) {
                var rockNode = new app.RockNode(entity);
                this.engine.canvas.addChild(rockNode);
                entity.bindContactEvent('postSolve', this);
            }
        };

        RockSystem.prototype.entityRemoved = function (entity) {
            if (entity.RockComponent !== undefined) {
                entity.unbindContactEvent('postSolve', this);
                this.engine.canvas.removeChildForEntity(entity);
            }
        };

        RockSystem.prototype.postSolve = function (entity, contactee, contact, impulse) {
            if (contactee.SquidComponent !== undefined && entity.HealthComponent !== undefined) {
                if (impulse.normalImpulses[0] > settings.minImpulseForDamage) {
                    entity.HealthComponent.health -= impulse.normalImpulses[0];
                }
            }
        };

        return RockSystem;

    }());

}(window));