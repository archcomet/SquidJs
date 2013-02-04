(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CreatureRenderSystem = (function () {

        var settings = {
            friction: 0.01,
            wind: 0.10,
            gravity: 0.05
        };

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
            this.shade = app.random(0.85, 1.1);
            this.controlPoints = [];
            this.outer = [];
            this.inner = [];

            for (i = 0, n = entity.TentaclesComponent.segmentCount, p = entity.PositionComponent; i < n; i++) {
                this.controlPoints.push(new ControlPoint(p.x, p.y));
            }
        }

        Tentacle.prototype.move = function (x, y, instant) {
            var i, n, point = this.controlPoints[0];
            point.x = x;
            point.y = y;

            if (instant) {
                for (i = 0, n = this.controlPoints.length; i < n; i++) {
                    point = this.controlPoints[i];
                    point.x = x;
                    point.y = y;
                }
            }
        };

        Tentacle.prototype.update = function () {
            var i, j, n, dx, dy, da, px, py, s, c, controlPoint, prev,
                segmentLength, friction, radius, step;

            segmentLength = this.entity.TentaclesComponent.segmentLength;

            friction = (this.entity.PhysicsComponent.outOfWater) ? 0.99 :
                    (this.entity.TentaclesComponent.friction - this.variance);
            friction *= (1 - settings.friction);

            radius = this.entity.TentaclesComponent.radius;
            step = radius / (this.controlPoints.length - 1);
            prev = this.controlPoints[0];

            for (i = 1, j = 0, n = this.controlPoints.length; i < n; i++, j++) {
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
         * CreatureRenderSystem
         * Rendering System for a creature type.
         * Draws the creature's body and tentacles
         * @param engine
         * @return {*}
         * @constructor
         */

        function CreatureRenderSystem(engine) {
            return CreatureRenderSystem.alloc(this, arguments);
        }
        app.inherit(app.System, CreatureRenderSystem);


        CreatureRenderSystem.prototype.init = function () {
            this.createModel([
                'TentaclesComponent',
                'BodyComponent',
                'ColorComponent',
                'SteeringComponent',
                'PositionComponent'
            ], this.entityAdded, this.entityRemoved);
            this.engine.bindEvent('update', this);
        };

        CreatureRenderSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.destroyModel();
        };

        CreatureRenderSystem.prototype.entityAdded = function (entity) {
            var i, n, creatureBodyNode, tentaclesNode,
                tentacles = entity.TentaclesComponent.tentacles  = [];

            for (i = 0, n = entity.TentaclesComponent.count; i < n; i++) {
                tentacles.push(new Tentacle(entity));
            }

            creatureBodyNode = new app.CreatureBodyNode(entity);
            tentaclesNode = new app.TentaclesNode(entity);
            creatureBodyNode.addChild(tentaclesNode, -1);
            this.engine.canvas.addChild(creatureBodyNode);
        };

        CreatureRenderSystem.prototype.entityRemoved = function (entity) {
            this.engine.canvas.removeChildForEntity(entity);
            entity.TentaclesComponent.tentacles.length = 0;
        };

        CreatureRenderSystem.prototype.update = function () {
            var i, n, entity;
            for (i = 0, n = this.model.entities.length; i < n; i++) {
                entity = this.model.entities[i];
                this.updateBody(entity);
                this.updateTentacles(entity);
            }
        };

        CreatureRenderSystem.prototype.updateBody = function (entity) {
            var target, vec, maxOffset,
                position = entity.PositionComponent,
                steering = entity.SteeringComponent,
                body = entity.BodyComponent;

            if (steering.drift) {
                vec = new b2.Vec2(0, 0);
            } else {
                target = steering.target;
                vec = new b2.Vec2(
                    target.x - position.x,
                    target.y - position.y
                );

                maxOffset = body.irisRadius * 0.45;
                if (vec.Length() > maxOffset) {
                    vec.Normalize();
                    vec.Multiply(maxOffset);
                }
            }

            body.irisPosition = {
                x: vec.x,
                y: vec.y
            };
        };

        CreatureRenderSystem.prototype.updateTentacles = function (entity) {
            var i, n, t, theta, px, py, step, radius,
                body = entity.BodyComponent,
                position = entity.PositionComponent,
                tentacles = entity.TentaclesComponent.tentacles;

            n = tentacles.length;
            t = this.engine.timer.counter;
            theta = 0;
            step = (Math.PI * 2) / (n + 1);
            radius = entity.TentaclesComponent.radius;
            radius *= 0.6 + Math.pow(Math.sin(t / body.radius), 12);

            for (i = 0; i < n; i++) {
                theta += step;
                px = Math.cos(theta) * radius;
                py = Math.sin(theta) * radius;

                tentacles[i].move(position.x + px, position.y + py);
                tentacles[i].update();
            }
        };

        return CreatureRenderSystem;

    }());

}(window));