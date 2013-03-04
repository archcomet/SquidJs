(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.SquidletAISystem = (function () {

        /**
         * SquidletAISystem
         * @return {*}
         * @constructor
         */

        function SquidletAISystem(engine) {
            return SquidletAISystem.alloc(this, arguments);
        }

        app.inherit(app.System, SquidletAISystem);

        SquidletAISystem.prototype.init = function () {
            this.target = undefined;
            this.settings = {
                followDistance: 75,
                relaxDistance: 200,
                sprintDistance: 400,
                evadeDistance: 700,
                fleeDistance: 500,
                hitImpulse: 10
            };

            this.engine.bindEvent('update', this);
            return this;
        };

        SquidletAISystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        SquidletAISystem.prototype.update = function () {
            this.updateSquidlets();
            this.observeSquid();
            this.observeRockSnake();
            this.updateBehavior();
        };

        SquidletAISystem.prototype.updateSquidlets = function () {
            var i, n, remaining, squidlet, squidletsToRemove = [];

            this.squidlets = this.engine.entitiesForComponent('SquidletAIComponent');
            this.position = { x: 0, y: 0 };

            if (this.squidlets.length === 0) {
                return;
            }

            remaining = 0;
            for (i = 0, n = this.squidlets.length; i < n; i += 1) {
                squidlet = this.squidlets[i];

                if (squidlet.HealthComponent.lastDamage > 0) {
                    squidlet.PhysicsComponent.body.ApplyImpulse({
                        x: squidlet.HealthComponent.lastDamageVector.x * this.settings.hitImpulse,
                        y: squidlet.HealthComponent.lastDamageVector.y * this.settings.hitImpulse
                    }, squidlet.PhysicsComponent.body.GetWorldCenter());
                }

                if (squidlet.HealthComponent.health > 0) {
                    remaining += 1;
                    this.position.x += squidlet.PositionComponent.x;
                    this.position.y += squidlet.PositionComponent.y;
                } else {
                    squidletsToRemove.push(squidlet);
                }
            }

            for (i = 0, n = squidletsToRemove.length; i < n; i += 1) {
                this.engine.factories.SquidletFactory.despawn(squidletsToRemove[i]);
            }

            if (remaining > 0) {
                this.position.x /= remaining;
                this.position.y /= remaining;
            }

            this.engine.triggerEvent('squidletSystemSet', this.position);
        };

        SquidletAISystem.prototype.observeSquid = function () {
            var vec, invDistance, squids = this.engine.entitiesForComponent('SquidPlayerComponent');
            this.squid = squids[squids.length - 1];
            this.squidDistance = -1;
            this.squidNormal = { x: 0, y: 0 };

            if (this.squid !== undefined) {
                vec = {
                    x: this.position.x - this.squid.PositionComponent.x,
                    y: this.position.y - this.squid.PositionComponent.y
                };
                this.squidDistance = app.vectorLength(vec);
                invDistance = 1 / this.squidDistance;

                this.squidNormal = {
                    x: vec.x * invDistance,
                    y: vec.y * invDistance
                };
            }
        };

        SquidletAISystem.prototype.observeRockSnake = function () {
            var i, n, len, minI, minLen = Infinity;

            this.rockSnakes = this.engine.entitiesForComponent('RockSnakeComponent');
            this.rockSnakeDistance = Infinity;
            this.rockSnake = undefined;

            if (this.rockSnakes.length === 0) {
                return;
            }

            for (i = 0, n = this.rockSnakes.length; i < n; i += 1) {

                len = app.vectorSquaredLength({
                    x: this.rockSnakes[i].PositionComponent.x - this.position.x,
                    y: this.rockSnakes[i].PositionComponent.y - this.position.y
                });

                if (len < minLen) {
                    minLen = len;
                    minI = i;
                }
            }

            this.rockSnake = this.rockSnakes[minI];
            this.rockSnakeDistance = Math.sqrt(minLen);
            if (this.rockSnakeDistance < Infinity) {
                this.rockSnakeNormal = {
                    x: (this.rockSnake.PositionComponent.x - this.squid.PositionComponent.x) / this.rockSnakeDistance,
                    y: (this.rockSnake.PositionComponent.y - this.squid.PositionComponent.y) / this.rockSnakeDistance
                };
            }
        };

        SquidletAISystem.prototype.updateBehavior = function () {

            if (this.rockSnakeDistance < this.settings.evadeDistance) {

                // Squidlet group will move opposite the player from the nearest rockSnake
                this.behavior = 'seek';
                this.target = {
                    x: this.squid.PositionComponent.x + this.rockSnakeNormal.x * -this.settings.fleeDistance,
                    y: this.squid.PositionComponent.y + this.rockSnakeNormal.y * -this.settings.fleeDistance
                };

                this.sprinting = true;

            } else if (this.squidDistance > this.settings.followDistance) {

                // Squidlets will follow the player
                this.behavior = 'seek';
                this.target = {
                    x: this.squid.PositionComponent.x + this.squidNormal.x * this.settings.followDistance,
                    y: this.squid.PositionComponent.y + this.squidNormal.y * this.settings.followDistance
                };

                // Squidlets will sprint to catch up if far enough away
                if (this.squidDistance > this.settings.sprintDistance) {
                    this.sprinting = true;
                } else if (this.sprinting && this.squidDistance < this.settings.relaxDistance) {
                    this.sprinting = false;
                }

            } else {

                // Squidlets will wait near the player and look at the player
                this.behavior = undefined;
                this.target = {
                    x: this.squid.PositionComponent.x,
                    y: this.squid.PositionComponent.y
                };
            }

            this.applyGroupBehavior();
        };

        SquidletAISystem.prototype.applyGroupBehavior = function () {
            var i, n, squidlet;
            for (i = 0, n = this.squidlets.length; i < n; i += 1) {
                squidlet = this.squidlets[i];

                //todo move this into the behavior processing
                if (squidlet.HealthComponent.stunFrames === 0) {
                    squidlet.SteeringComponent.behavior = this.behavior;
                } else {
                    squidlet.SteeringComponent.behavior = undefined;
                }

                squidlet.SteeringComponent.sprinting = this.sprinting;
                squidlet.SteeringComponent.target = this.target || {
                    x: squidlet.PositionComponent.x,
                    y: squidlet.PositionComponent.y
                };
                squidlet.SquidComponent.lookAt = (this.squid !== undefined) ?
                        this.squid.PositionComponent : squidlet.PositionComponent;
            }
        };

        return SquidletAISystem;

    }());

}(window));