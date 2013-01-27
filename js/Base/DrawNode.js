(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.DrawNode = (function () {

        /**
         * DrawNode
         * A hierarchical data structure for drawing.
         * @param model
         * @param zOrder
         * @param drawFunction
         * @return {*}
         * @constructor
         */

        function DrawNode(model, zOrder, drawFunction) {
            return DrawNode.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, DrawNode);

        DrawNode.prototype.init = function (model, zOrder, drawFunction) {
            this.model = model;
            this.nodes = [];
            this.drawFunction = drawFunction;
            this.z = zOrder || 0;
            return this;
        };

        DrawNode.prototype.addChild = function (drawNode) {
            this.nodes.push(drawNode);
            _.sortBy(this.nodes, function (node) { return node.z; });
        };

        DrawNode.prototype.removeChild = function (drawNode) {
            var i, n;
            for (i = 0, n < this.nodes.length; i < n; i++) {
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

        DrawNode.prototype.deleteChildByModel = function (model) {
            var i, n, node;
            for (i = 0, n = this.nodes.length; i < n; i++) {
                if (this.nodes[i].model === model) {
                    node = this.nodes.splice(i, 1);
                    node.removeAllChildren(true);
                    return;
                }
            }
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

            if (this.drawFunction) {
                this.drawFunction(ctx, this.model);
            }

            for (i; i < n; i++) {
                node = this.nodes[i];
                node.draw(ctx);
            }
        };

        return DrawNode;

    }());

}(window));