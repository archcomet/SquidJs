(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.RockSnakeAISystem = (function () {

        /**
         * RockSnakeAISystem
         * @return {*}
         * @constructor
         */

        function RockSnakeAISystem(engine) {
            return RockSnakeAISystem.alloc(this, arguments);
        }

        app.inherit(app.System, RockSnakeAISystem);

        RockSnakeAISystem.prototype.init = function () {
            this.target = undefined;
            this.settings = {
                hitImpulse: 400,
                fleeDistance: 700
            };

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('squidletSystemSet', this);
            return this;
        };

        RockSnakeAISystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('squidletSystemSet', this);
        };

        RockSnakeAISystem.prototype.update = function () {
            var i, n, rockSnake, rockSnakes, rockSnakesToRemove = [];
            rockSnakes = this.engine.entitiesForComponent('RockSnakeAIComponent');

            for (i = 0, n = rockSnakes.length; i < n; i += 1) {
                rockSnake = rockSnakes[i];

                if (rockSnake.HealthComponent.lastDamage > 0) {
                    rockSnake.PhysicsComponent.body.ApplyImpulse({
                        x: rockSnake.HealthComponent.lastDamageVector.x * this.settings.hitImpulse,
                        y: rockSnake.HealthComponent.lastDamageVector.y * this.settings.hitImpulse
                    }, rockSnake.PhysicsComponent.body.GetWorldCenter());
                    rockSnake.HealthComponent.stunFrames = 120;
                    this.fleeTarget = rockSnake.HealthComponent.lastDamageDealer;
                }

                if (rockSnake.HealthComponent.health <= 0) {
                    rockSnakesToRemove.push(rockSnake);
                }
                rockSnake.SteeringComponent.behavior = undefined;
                if (rockSnake.HealthComponent.stunFrames === 0) {
                    if (this.target !== undefined) {
                        rockSnake.SteeringComponent.behavior = 'seek';
                        rockSnake.SteeringComponent.target = this.target;
                        rockSnake.SteeringComponent.sprinting = false;
                    }
                } else {
                    rockSnake.SteeringComponent.behavior = 'seek';
                    rockSnake.SteeringComponent.target = new b2.Vec2();
                    rockSnake.SteeringComponent.target.SetV({
                        x: rockSnake.PositionComponent.x - this.fleeTarget.PositionComponent.x,
                        y: rockSnake.PositionComponent.y - this.fleeTarget.PositionComponent.y
                    });
                    rockSnake.SteeringComponent.target.Normalize();
                    rockSnake.SteeringComponent.target.Multiply(this.settings.fleeDistance);
                    rockSnake.SteeringComponent.target.Add(rockSnake.PositionComponent);
                }
            }

            for (i = 0, n = rockSnakesToRemove.length; i < n; i += 1) {
                this.engine.factories.RockSnakeFactory.despawn(rockSnakesToRemove[i]);
            }
        };

        RockSnakeAISystem.prototype.squidletSystemSet = function (position) {
            this.target = position;
        };

        return RockSnakeAISystem;

    }());

}(window));