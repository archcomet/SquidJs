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
         * Node
         * Point data used Tentacle Object
         * @param x
         * @param y
         * @constructor
         */

        function Node(x, y) {
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
            this.nodes = [];
            this.outer = [];
            this.inner = [];

            for (i = 0, n = entity.TentaclesComponent.segmentCount, p = entity.PositionComponent; i < n; i++) {
                this.nodes.push(new Node(p.x, p.y));
            }
        }

        Tentacle.prototype.move = function (x, y, instant) {
            var i, n, node = this.nodes[0];
            node.x = x;
            node.y = y;

            if (instant) {
                for (i = 0, n = this.nodes.length; i < n; i++) {
                    node = this.nodes[i];
                    node.x = x;
                    node.y = y;
                }
            }
        };

        Tentacle.prototype.update = function () {
            var i, j, n, dx, dy, da, px, py, s, c, node, prev,
                segmentLength, friction, radius, step;

            segmentLength = this.entity.TentaclesComponent.segmentLength;

            friction = (this.entity.PhysicsComponent.outOfWater) ? 0.99 :
                    (this.entity.TentaclesComponent.friction - this.variance);
            friction *= (1 - settings.friction);

            radius = this.entity.TentaclesComponent.radius;
            step = radius / (this.nodes.length - 1);
            prev = this.nodes[0];

            for (i = 1, j = 0, n = this.nodes.length; i < n; i++, j++) {
                node = this.nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                dx = prev.x - node.x;
                dy = prev.y - node.y;
                da = Math.atan2(dy, dx);

                px = node.x + Math.cos(da) * segmentLength;
                py = node.y + Math.sin(da) * segmentLength;

                node.x = prev.x - (px - node.x);
                node.y = prev.y - (py - node.y);

                node.vx = (node.x - node.ox) * friction + settings.wind;
                node.vy = (node.y - node.oy) * friction + settings.gravity;

                node.ox = node.x;
                node.oy = node.y;

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

                prev = node;
            }
        };

        Tentacle.prototype.draw = function (ctx) {
            var o, i, color, h, s, v;

            o = this.outer[0];
            i = this.inner[0];

            ctx.beginPath();
            ctx.moveTo(o.x, o.y);
            ctx.curveThroughPoints(this.outer);
            ctx.curveThroughPoints(this.inner.reverse());
            ctx.lineTo(i.x, i.y);
            ctx.closePath();

            color = this.entity.ColorComponent;
            h = color.h * this.shade;
            s = color.s * this.shade * color.shade;
            v = color.v * this.shade * color.shade;

            ctx.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + v + '%)';
            ctx.fill();

            if (this.entity.TentaclesComponent.radius > 2) {
                ctx.strokeStyle = this.entity.ColorComponent.hslStroke;
                ctx.lineWidth = 1;
                ctx.stroke();
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
            var i, n, bodyDrawNode, tentacleDrawNode,
                tentacles = entity.TentaclesComponent.tentacles  = [];

            for (i = 0, n = entity.TentaclesComponent.count; i < n; i++) {
                tentacles.push(new Tentacle(entity));
            }

            bodyDrawNode = new app.DrawNode(entity, this.drawBody, entity.PositionComponent.zOrder);
            tentacleDrawNode = new app.DrawNode(entity, this.drawTentacles, -1);
            bodyDrawNode.addChild(tentacleDrawNode);

            this.engine.canvas.addChild(bodyDrawNode);
            //todo drawnode teardown
        };

        CreatureRenderSystem.prototype.entityRemoved = function (entity) {
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
                x: position.x + vec.x,
                y: position.y + vec.y
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

        CreatureRenderSystem.prototype.drawBody = function (ctx, entity) {
            var t, position = entity.PositionComponent,
                body = entity.BodyComponent,
                color = entity.ColorComponent,
                radius = body.radius;

            t = entity.engine.timer.counter;
            radius *= 1.0 + Math.pow(Math.sin(t / radius), 12) / 10;

            ctx.beginPath();
            ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, false);
            ctx.lineWidth = body.thickness;
            ctx.fillStyle = color.hslFill;
            ctx.strokeStyle = color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(position.x, position.y, body.eyeRadius, 0, Math.PI * 2, false);
            ctx.lineWidth = 1;
            ctx.fillStyle = 'hsl(0, 0%, 100%)';
            ctx.strokeStyle = color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(body.irisPosition.x, body.irisPosition.y, body.irisRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'hsl(0, 0%, 0%)';
            ctx.fill();
        };

        CreatureRenderSystem.prototype.drawTentacles = function (ctx, entity) {
            var i, n = entity.TentaclesComponent.tentacles.length;
            for (i = 0; i < n; i++) {
                entity.TentaclesComponent.tentacles[i].draw(ctx);
            }
        };

        return CreatureRenderSystem;

    }());

}(window));