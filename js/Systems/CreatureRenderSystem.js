(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CreatureRenderSystem = (function () {

        var settings = {
            friction: 0.01,
            wind: 0.00,
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
         * @param model
         * @constructor
         */

        function Tentacle(model) {
            var i, n, p, variance;
            variance = model.tentacleData.variance;

            this.model = model;
            this.variance = random(-variance, variance);
            this.shade = random(0.85, 1.1);
            this.nodes = [];
            this.outer = [];
            this.inner = [];

            for (i = 0, n = model.tentacleData.segmentCount, p = model.position; i < n; i++) {
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

            segmentLength = this.model.tentacleData.segmentLength;
            friction = (this.model.tentacleData.friction - this.variance) * (1 - settings.friction);
            radius = this.model.tentacleData.radius;
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

                s = Math.sin(da + HALF_PI);
                c = Math.cos(da + HALF_PI);

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

            color = this.model.color;
            h = color.h * this.shade;
            s = color.s * this.shade;
            v = color.v * this.shade;

            ctx.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + v + '%)';
            ctx.fill();

            if (this.model.tentacleData.radius > 2) {
                ctx.strokeStyle = this.model.color.hslStroke;
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
            this.modelList = this.engine.createModelList('creatureRender', {
                tentacleData: 'TentaclesComponent',
                body: 'BodyComponent',
                color: 'ColorComponent',
                steering: 'SteeringComponent',
                position: 'PositionComponent'
            });

            this.engine.bindEvent('creatureRenderAdded', this, this.creatureAdded);
            this.engine.bindEvent('creatureRenderRemoved', this, this.creatureRemoved);
            this.engine.bindEvent('update', this, this.update);
        };

        CreatureRenderSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('creatureRenderRemoved', this);
            this.engine.unbindEvent('creatureRenderAdded', this);
            this.engine.destroyModelList(this.modelList.name);
        };

        CreatureRenderSystem.prototype.creatureAdded = function (model) {
            var i, n, bodyDrawNode, tentacleDrawNode;

            model.tentacleArray  = [];
            for (i = 0, n = model.tentacleData.count; i < n; i++) {
                model.tentacleArray.push(new Tentacle(model));
            }

            bodyDrawNode = new app.DrawNode(model, model.position.zOrder, this.drawBody);
            tentacleDrawNode = new app.DrawNode(model, -1, this.drawTentacles);
            bodyDrawNode.addChild(tentacleDrawNode);
            this.engine.canvas.addChild(bodyDrawNode);
        };

        CreatureRenderSystem.prototype.creatureRemoved = function (model) {
            model.tentacleArray.length = 0;
        };

        CreatureRenderSystem.prototype.update = function (dt) {
            var i, n, model, models;
            models = this.modelList.models;
            for (i = 0, n = models.length; i < n; i++) {
                model = models[i];
                this.updateBody(model);
                this.updateTentacles(model);
            }
        };

        CreatureRenderSystem.prototype.updateBody = function (model) {
            var position, target, vec, maxOffset;
            position = model.position;

            if (model.steering.drift) {

                vec = new b2.Vec2(0, 0);

            } else {

                target = model.steering.target;

                vec = new b2.Vec2(
                    target.x - position.x,
                    target.y - position.y
                );

                maxOffset = model.body.irisRadius * 0.45;

                if (vec.Length() > maxOffset) {
                    vec.Normalize();
                    vec.Multiply(maxOffset);
                }
            }

            model.body.irisPosition = {
                x: position.x + vec.x,
                y: position.y + vec.y
            };
        };

        CreatureRenderSystem.prototype.updateTentacles = function (model) {
            var i, n, theta, px, py, step, radius, tentacleArray;

            tentacleArray = model.tentacleArray;
            n = tentacleArray.length;
            theta = 0;
            step = TWO_PI / (n + 1);
            radius = model.tentacleData.radius;

            for (i = 0; i < n; i++) {
                theta += step;
                px = Math.cos(theta) * radius;
                py = Math.sin(theta) * radius;

                tentacleArray[i].move(model.position.x + px, model.position.y + py);
                tentacleArray[i].update();
            }
        };

        CreatureRenderSystem.prototype.drawBody = function (ctx, model) {
            ctx.beginPath();
            ctx.arc(model.position.x, model.position.y, model.body.radius, 0, TWO_PI, false);
            ctx.lineWidth = model.body.thickness;
            ctx.fillStyle = model.color.hslFill;
            ctx.strokeStyle = model.color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(model.position.x, model.position.y, model.body.eyeRadius, 0, TWO_PI, false);
            ctx.lineWidth = 1;
            ctx.fillStyle = 'hsl(0, 0%, 100%)';
            ctx.strokeStyle = model.color.hslStroke;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(model.body.irisPosition.x, model.body.irisPosition.y, model.body.irisRadius, 0, TWO_PI, false);
            ctx.fillStyle = 'hsl(0, 0%, 0%)';
            ctx.fill();
        };

        CreatureRenderSystem.prototype.drawTentacles = function (ctx, model) {
            var i, n = model.tentacleArray.length;
            for (i = 0; i < n; i++) {
                model.tentacleArray[i].draw(ctx);
            }
        };

        return CreatureRenderSystem;

    }());

}(window));