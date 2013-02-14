(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSystem = (function () {

        var settings = {
            minImpulseForDamage: 4,
            minRadiusForFragments: 15,
            numberOfFragments: 3
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
            this.createModel(
                ['RockComponent'],
                this.entityAdded,
                this.entityRemoved
            );
            this.engine.bindEvent('update', this);
            return this;
        };

        RockSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.destroyModel();
        };

        RockSystem.prototype.update = function (dt) {
            var i, n, entity,
                entities = this.model.entities,
                rocksDestroyed = [];

            for (i = 0, n = entities.length; i < n; i += 1) {
                entity = entities[i];
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
            var i, n, fragment, rads, step, impulse, impulseNormal, body,
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

            rockFactory.destroyRock(entity);
        };

        RockSystem.prototype.entityAdded = function (entity) {
            var rockNode = new app.RockNode(entity);
            this.engine.canvas.addChild(rockNode);
            entity.bindContactEvent('postSolve', this);
        };

        RockSystem.prototype.entityRemoved = function (entity) {
            entity.unbindContactEvent('postSolve', this);
            this.engine.canvas.removeChildForEntity(entity);
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