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
                fleeDistance: 500
            };

            this.engine.bindEvent('update', this);
            return this;
        };

        SquidletAISystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        SquidletAISystem.prototype.update = function () {

            this.updateSquidletData();
            this.updateSquidData();
            this.updateRockSnakeData();
            this.updateBehavior();
            this.applyBehavior();
        };

        SquidletAISystem.prototype.updateSquidletData = function () {
            var i, n, squidlet;

            this.squidlets = this.engine.entitiesForComponent('SquidletAIComponent');
            this.position = { x: 0, y: 0 };

            if (this.squidlets.length === 0) {
                return;
            }

            for (i = 0, n = this.squidlets.length; i < n; i += 1) {
                squidlet = this.squidlets[i];
                this.position.x += squidlet.PositionComponent.x;
                this.position.y += squidlet.PositionComponent.y;
            }

            this.position.x /= n;
            this.position.y /= n;
        };

        SquidletAISystem.prototype.updateSquidData = function () {
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

        SquidletAISystem.prototype.updateRockSnakeData = function () {
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
            this.rockSnakeNormal = {
                x: (this.rockSnake.PositionComponent.x - this.squid.PositionComponent.x) / this.rockSnakeDistance,
                y: (this.rockSnake.PositionComponent.y - this.squid.PositionComponent.y) / this.rockSnakeDistance
            };
        };

        SquidletAISystem.prototype.updateBehavior = function () {
            this.behavior = undefined;
            this.target = undefined;

            // Determine behavior and target
            if (this.rockSnakeDistance < this.settings.evadeDistance) {

                // Calculate flee target
                this.behavior = 'seek';
                this.target = {
                    x: this.squid.PositionComponent.x + this.rockSnakeNormal.x * -this.settings.fleeDistance,
                    y: this.squid.PositionComponent.y + this.rockSnakeNormal.y * -this.settings.fleeDistance
                };

                this.sprinting = true;

            } else if (this.squidDistance > this.settings.followDistance) {

                // Calculate follow target
                this.behavior = 'seek';
                this.target = {
                    x: this.squid.PositionComponent.x + this.squidNormal.x * this.settings.followDistance,
                    y: this.squid.PositionComponent.y + this.squidNormal.y * this.settings.followDistance
                };

                // Determine if sprinting
                if (this.squidDistance > this.settings.sprintDistance) {
                    this.sprinting = true;
                } else if (this.sprinting && this.squidDistance < this.settings.relaxDistance) {
                    this.sprinting = false;
                }
            }

            // If no target is set and there is a squid, default target to player
            if (this.target === undefined && this.squid !== undefined) {
                this.target = {
                    x: this.squid.PositionComponent.x,
                    y: this.squid.PositionComponent.y
                };
            }
        };

        SquidletAISystem.prototype.applyBehavior = function () {
            var i, n, squidlet;
            for (i = 0, n = this.squidlets.length; i < n; i += 1) {
                squidlet = this.squidlets[i];
                squidlet.SteeringComponent.behavior = this.behavior;
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