(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.TentaclesSystem = (function () {

        /**
         * ControlPoint
         * Point data used Tentacle Object
         * @param x
         * @param y
         * @constructor
         */

        function ControlPoint(x, y) {
            this.x = this.ox = x || 0.0;
            this.y = this.oy = y || 0.0;
            this.vx = 0.0;
            this.vy = 0.0;
        }

        /**
         * Tentacle
         * ViewModel for a tentacle using inverse kinematics.
         * @param entity
         * @constructor
         */

        function Tentacle(entity) {
            var i, n, p, variance;
            variance = entity.TentaclesComponent.variance;

            this.entity = entity;
            this.variance = app.random(-variance, variance);
            this.controlPoints = [];
            this.outer = [];
            this.inner = [];

            for (i = 0, n = entity.TentaclesComponent.segmentCount, p = entity.PositionComponent; i < n; i += 1) {
                this.controlPoints.push(new ControlPoint(p.x, p.y));
            }
        }

        Tentacle.prototype.move = function (x, y, instant) {
            var i, n, point = this.controlPoints[0];
            point.x = x;
            point.y = y;

            if (instant) {
                for (i = 0, n = this.controlPoints.length; i < n; i += 1) {
                    point = this.controlPoints[i];
                    point.x = x;
                    point.y = y;
                }
            }
        };

        Tentacle.prototype.update = function () {
            var i, j, n, dx, dy, da, px, py, s, c, controlPoint, prev,
                segmentLength, friction, radius, step, settings;

            segmentLength = this.entity.TentaclesComponent.segmentLength;
            settings = this.entity.engine.setting.tentaclesSystem;

            friction = (this.entity.PhysicsComponent.outOfWater) ? 0.99 : (this.entity.TentaclesComponent.friction - this.variance);
            friction *= (1 - settings.friction);

            radius = this.entity.TentaclesComponent.radius;
            step = radius / (this.controlPoints.length - 1);
            prev = this.controlPoints[0];

            for (i = 1, j = 0, n = this.controlPoints.length; i < n; i += 1, j += 1) {
                controlPoint = this.controlPoints[i];
                controlPoint.x += controlPoint.vx;
                controlPoint.y += controlPoint.vy;

                dx = prev.x - controlPoint.x;
                dy = prev.y - controlPoint.y;
                da = Math.atan2(dy, dx);

                px = controlPoint.x + Math.cos(da) * segmentLength;
                py = controlPoint.y + Math.sin(da) * segmentLength;

                controlPoint.x = prev.x - (px - controlPoint.x);
                controlPoint.y = prev.y - (py - controlPoint.y);

                controlPoint.vx = (controlPoint.x - controlPoint.ox) * friction + settings.wind;
                controlPoint.vy = (controlPoint.y - controlPoint.oy) * friction + settings.gravity;

                controlPoint.ox = controlPoint.x;
                controlPoint.oy = controlPoint.y;

                s = Math.sin(da + Math.PI * 0.5);
                c = Math.cos(da + Math.PI * 0.5);

                radius -= step;

                this.outer[j] = {
                    x: prev.x + c * radius,
                    y: prev.y + s * radius
                };

                this.inner[j] = {
                    x: prev.x - c * radius,
                    y: prev.y - s * radius
                };

                prev = controlPoint;
            }
        };

        /**
         * TentaclesSystem
         * @return {TentaclesSystem}
         * @constructor
         */

        function TentaclesSystem(engine) {
            return TentaclesSystem.alloc(this, arguments);
        }

        app.inherit(app.System, TentaclesSystem);

        TentaclesSystem.prototype.init = function () {
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);
            this.engine.bindEvent('update', this);
            return this;
        };

        TentaclesSystem.prototype.deinit = function () {
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);
            this.engine.unbindEvent('update', this);
            return this;
        };

        /*** Update Event ***/

        TentaclesSystem.prototype.update = function () {
            var i, n, entityArray = this.engine.entitiesForComponent('TentaclesComponent');
            for (i = 0, n = entityArray.length; i < n; i += 1) {
                this.updateTentacles(entityArray[i]);
            }
        };

        TentaclesSystem.prototype.entityAdded = function (entity) {
            if (entity.TentaclesComponent !== undefined) {
                var i, n, tentacles = entity.TentaclesComponent.tentacles = [];

                for (i = 0, n = entity.TentaclesComponent.count; i < n; i += 1) {
                    tentacles.push(new Tentacle(entity));
                }
            }
        };

        TentaclesSystem.prototype.updateTentacles = function (entity) {
            var i, n, t, theta, px, py, step, radius,
                body = entity.SquidComponent,
                position = entity.PositionComponent,
                tentacles = entity.TentaclesComponent.tentacles;

            n = tentacles.length;
            t = this.engine.timer.counter;
            theta = 0;
            step = (Math.PI * 2) / (n + 1);
            radius = entity.TentaclesComponent.radius;
            radius *= 0.6 + Math.pow(Math.sin(t / body.radius), 12);

            for (i = 0; i < n; i += 1) {
                theta += step;
                px = Math.cos(theta) * radius;
                py = Math.sin(theta) * radius;

                tentacles[i].move(position.x + px, position.y + py);
                tentacles[i].update();
            }
        };

        /*** Entity Events ***/

        TentaclesSystem.prototype.entityRemoved = function (entity) {
            if (entity.TentaclesComponent !== undefined) {
                entity.TentaclesComponent.tentacles.length = 0;
            }
        };

        return TentaclesSystem;

    }());

}(window));