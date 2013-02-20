(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode = (function () {

        /**
         * DrawNode
         * A hierarchical data structure for drawing.
         * @param entity
         * @return {*}
         * @constructor
         */

        function DrawNode(entity) {
            return DrawNode.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, DrawNode);

        DrawNode.prototype.init = function (entity) {
            this.entity = entity;
            this.nodes = [];
            this.zOrder = 0;
            this.autotransform = true;

            if (entity !== undefined) {
                if (entity.PositionComponent !== undefined) {
                    this.zOrder = entity.PositionComponent.zOrder;
                }
            }

            return this;
        };

        DrawNode.prototype.deinit = function () {
            this.removeAllChildren(true);
        };

        DrawNode.prototype.addChild = function (drawNode, zOrder) {
            drawNode.zOrder = zOrder || 0;
            this.nodes.push(drawNode);
            this.nodes.sort(function (a, b) { return a.zOrder - b.zOrder; });
        };

        DrawNode.prototype.removeChild = function (drawNode) {
            var i, n;
            for (i = 0, n = this.nodes.length; i < n; i += 1) {
                if (this.nodes[i] === drawNode) {
                    this.nodes.splice(i, 1);
                    return;
                }
            }
        };

        DrawNode.prototype.removeAllChildren = function (cleanup) {
            var i, n;
            if (cleanup) {
                for (i = 0, n = this.nodes.length; i < n; i += 1) {
                    this.nodes[i].removeAllChildren(true);
                }
            }
            this.nodes.length = 0;
        };

        DrawNode.prototype.visit = function (ctx) {
            var node, position, i, n = this.nodes.length;
            for (i = 0, n < this.nodes.length; i < n; i += 1) {
                node = this.nodes[i];
                if (node.zOrder < this.zOrder) {
                    node.visit(ctx);
                } else {
                    break;
                }
            }

            if (this.autotransform && this.entity && this.entity.PositionComponent) {
                position = this.entity.PositionComponent;
                ctx.translate(position.x, position.y);
                ctx.rotate(position.angle);
                this.draw(ctx);
                ctx.rotate(-position.angle);
                ctx.translate(-position.x, -position.y);
            } else {
                this.draw(ctx);
            }

            for (i; i < n; i += 1) {
                node = this.nodes[i];
                node.visit(ctx);
            }
        };

        DrawNode.prototype.draw = function (ctx) {
            // does nothing
        };

        return DrawNode;

    }());

}(window));