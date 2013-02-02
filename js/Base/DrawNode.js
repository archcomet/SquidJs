(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode = (function () {

        /**
         * DrawNode
         * A hierarchical data structure for drawing.
         * @param entity
         * @param zOrder
         * @param drawCallback
         * @return {*}
         * @constructor
         */

        function DrawNode(entity, drawCallback, zOrder) {
            return DrawNode.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, DrawNode);

        DrawNode.prototype.init = function (entity, drawCallback, zOrder) {
            this.entity = entity;
            this.nodes = [];
            this.drawCallback = drawCallback;
            this.z = zOrder || 0;
            return this;
        };

        DrawNode.prototype.deinit = function () {
            this.removeAllChildren(true);
        };

        DrawNode.prototype.addChild = function (drawNode) {
            this.nodes.push(drawNode);
            _.sortBy(this.nodes, function (node) { return node.z; });
        };

        DrawNode.prototype.removeChild = function (drawNode) {
            var i, n;
            for (i = 0, n = this.nodes.length; i < n; i++) {
                if (this.nodes[i] === drawNode) {
                    this.nodes.splice(i, 1);
                    return;
                }
            }
        };

        DrawNode.prototype.removeAllChildren = function (cleanup) {
            var i, n;
            if (cleanup) {
                for (i = 0, n = this.nodes.length; i < n; i++) {
                    this.nodes[i].removeAllChildren(true);
                }
            }
            this.nodes.length = 0;
        };

        DrawNode.prototype.draw = function (ctx) {
            var node, i, n = this.nodes.length;
            for (i = 0, n < this.nodes.length; i < n; i++) {
                node = this.nodes[i];
                if (node.z < this.z) {
                    node.draw(ctx);
                } else {
                    break;
                }
            }

            if (this.drawCallback) {
                this.drawCallback(ctx, this.entity);
            }

            for (i; i < n; i++) {
                node = this.nodes[i];
                node.draw(ctx);
            }
        };

        return DrawNode;

    }());

}(window));