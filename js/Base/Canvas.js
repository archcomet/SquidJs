(function (global) {
    "use strict";

    global.app = global.app || {};


    global.app.Canvas = (function () {

        /**
         * curveThroughPoints
         * Utility function for drawing quadraticCurves through a series of points.
         * @param points
         */

        global.CanvasRenderingContext2D.prototype.curveThroughPoints = function (points) {
            var i, n, a, b, x, y;
            this.lineJoin = 'mitter';
            for (i = 1, n = points.length - 2; i < n; i += 1) {
                a = points[i];
                b = points[i + 1];
                x = (a.x + b.x) * 0.5;
                y = (a.y + b.y) * 0.5;
                this.quadraticCurveTo(a.x, a.y, x, y);
            }
            a = points[i];
            b = points[i + 1];
            this.quadraticCurveTo(a.x, a.y, b.x, b.y);
        };

        (function () {
            var fillCache = '',
                strokeCache = '';

            global.CanvasRenderingContext2D.prototype.setCachedFillStyle = function (fillStyle) {
                if (fillStyle !== fillCache) {
                    this.fillStyle = fillStyle;
                    fillCache = fillStyle;
                }
            };

            global.CanvasRenderingContext2D.prototype.setCachedStrokeStyle = function (strokeStyle) {
                if (strokeStyle !== strokeCache) {
                    this.strokeStyle = strokeStyle;
                    strokeCache = strokeStyle;
                }
            };

            global.CanvasRenderingContext2D.prototype.clearFillCache = function () {
                fillCache = '';
                strokeCache = '';
            };
        }());

        /**
         * Canvas
         * Wrapper for HTML5 canvas
         * @param options
         * @return {*}
         * @constructor
         */

        function Canvas(options) {
            return Canvas.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, Canvas);

        Canvas.prototype.init = function (options) {
            var self = this;
            _.defaults(this, options, {
                autoclear: true,
                fullscreen: true,
                context: '2d',
                container: undefined,
                interval: 1,
                zIndex: 0,
                engine: undefined,
                width: 0,
                height: 0,
                cameraRate: 0
            });

            this.center = {
                x: 0,
                y: 0
            };

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext(this.context);
            this.rootNode = new app.DrawNode();

            this.resize();
            this.engine.bindEvent('resize', this);

            if (this.zIndex !== 0) {
                $(this.canvas).css('z-index', this.zIndex);
            }

            if (this.cameraRate !== 0) {
                this.engine.bindEvent('cameraSet', this);
            }

            if (this.container) {
                $(this.canvas).appendTo(this.container);
            }

            return this;
        };

        /*** Canvas Size ***/

        Canvas.prototype.resize = function () {
            if (this.fullscreen) {
                var x = (window.innerWidth < app.maxWidth) ? window.innerWidth : app.maxWidth,
                    y = (window.innerHeight < app.maxHeight) ? window.innerHeight : app.maxHeight;
                this.width = this.ctx.width = this.canvas.width = x;
                this.height = this.ctx.height = this.canvas.height = y;
            } else {
                this.ctx.width = this.canvas.width = this.width;
                this.ctx.height = this.canvas.height = this.height;
            }

            $(this.canvas).css('left', Math.floor(-this.canvas.width / 2));
            $(this.canvas).css('top', Math.floor(-this.canvas.height / 2));
        };

        /*** Camera Position ***/

        Canvas.prototype.cameraSet = function (position) {
            this.center.x = position.x * this.cameraRate;
            this.center.y = position.y * this.cameraRate;
        };

        Canvas.prototype.getOffset = function () {
            var x = this.center.x - this.width / 2,
                y = this.center.y - this.height / 2;
            return { x: x, y: y };
        };

        /*** Node Management ***/

        Canvas.prototype.addChild = function (child, zOrder) {
            this.rootNode.addChild(child, zOrder);
        };

        Canvas.prototype.removeChild = function (child) {
            this.rootNode.removeChild(child);
        };

        Canvas.prototype.removeChildForEntity = function (entity) {
            this.rootNode.removeChildForEntity(entity);
        };

        Canvas.prototype.draw = function () {
            var x = -1 * this.center.x + this.width / 2,
                y = -1 * this.center.y + this.height / 2;

            this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
            this.ctx.save();
            this.ctx.translate(x, y);
            this.rootNode.visit(this.ctx);
            this.ctx.restore();
            this.ctx.clearFillCache();
        };

        return Canvas;

    }());
}(window));