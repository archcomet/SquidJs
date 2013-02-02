(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.BackgroundSystem = (function () {

        /**
         * BackgroundSystem
         * @param engine
         * @return {*}
         * @constructor
         */

        function BackgroundSystem(engine) {
            return BackgroundSystem.alloc(this, arguments);
        }
        app.inherit(app.System, BackgroundSystem);

        BackgroundSystem.prototype.init = function () {
            this.createModel(['ColorComponent']);

            this.position = {
                x: 0,
                y: 0,
                ox: 0,
                oy: 0
            };

            this.noiseLayerDirty = true;
            this.lightLayerDirty = true;
            this.gradientLayerDirty = true;
            this.gradientLastY = undefined;
            this.gradientModifier = 1;
            this.image = new Image();
            this.image.src = 'images/backgroundNoise.png';
            this.image.onload = this.createCanvases.bind(this);

            return this;
        };

        BackgroundSystem.prototype.deinit = function () {
            this.destroyModel();
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('draw', this);
            this.engine.unbindEvent('cameraSet', this);
            this.engine.unbindEvent('resize', this);
        };

        BackgroundSystem.prototype.createCanvases = function () {

            this.surfaceLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -1,
                engine: this.engine
            });

            this.noiseLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -2,
                engine: this.engine
            });

            this.lightLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -3,
                engine: this.engine
            });

            this.gradientLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -4,
                engine: this.engine
            });

            this.noisePattern = this.noiseLayer.ctx.createPattern(this.image, 'repeat');

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('draw', this);
            this.engine.bindEvent('cameraSet', this);
            this.engine.bindEvent('resize', this);
        };

        BackgroundSystem.prototype.drawSurface = function () {
            var ctx = this.surfaceLayer.ctx;
            ctx.clearRect(0, 0, ctx.width, ctx.height);

            if (this.position.y < 500) {
                ctx.fillRect(0, 0, ctx.width, 500 - this.position.y);
            }
        };

        BackgroundSystem.prototype.drawNoise = function () {
            if (this.noiseLayerDirty) {

                var x1, y1, x2, y2, ctx = this.noiseLayer.ctx;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.fillStyle = this.noisePattern;

                x1 = this.position.ox * 0.5;
                y1 = this.position.oy * 0.5;
                ctx.globalAlpha = 0.7;
                ctx.translate(x1, y1);
                ctx.fillRect(-x1, -y1, ctx.width, ctx.height);
                ctx.translate(-x1, -y1);

                x2 = this.position.ox * 0.3;
                y2 = this.position.oy * 0.3;
                ctx.globalAlpha = 0.5;
                ctx.translate(x2, y2);
                ctx.fillRect(-x2, -y2, ctx.width, ctx.height);
                ctx.translate(-x2, -y2);

                this.noiseLayerDirty = false;
            }
        };

        BackgroundSystem.prototype.drawLight = function (data) {
            var i, grd, ctx = this.lightLayer.ctx;

            grd = ctx.createLinearGradient(data.x1, data.y1, data.x2, data.y2);
            grd.addColorStop(0, 'rgba(5, 229, 245, 0.25)');
            grd.addColorStop(0.9, 'rgba(5, 229, 245, 0)');
            ctx.fillStyle = grd;
            ctx.globalAlpha = 0.5;

            for (i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(data.x1 - data.topRadius * i, data.y1);
                ctx.lineTo(data.x2 - data.bottomRadius * i, data.y2);
                ctx.lineTo(data.x2 + data.bottomRadius * i, data.y2);
                ctx.lineTo(data.x1 + data.topRadius * i, data.y1);
                ctx.closePath();
                ctx.fill();
            }
        };

        BackgroundSystem.prototype.drawLights = function () {
            if (this.lightLayerDirty) {
                this.drawLight({
                    x1: 30,
                    y1: 0,
                    x2: 400,
                    y2: 1000,
                    topRadius: 6,
                    bottomRadius: 40
                });

                this.drawLight({
                    x1: 110,
                    y1: 0,
                    x2: 800,
                    y2: 900,
                    topRadius: 8,
                    bottomRadius: 45
                });

                this.drawLight({
                    x1: 200,
                    y1: 0,
                    x2: 1200,
                    y2: 800,
                    topRadius: 10,
                    bottomRadius: 50
                });
                this.lightLayerDirty = false;
            }
        };

        BackgroundSystem.prototype.drawGradient = function () {
            if (this.gradientLayerDirty) {
                var radius, grd,
                    mod = this.gradientModifier,
                    ctx = this.gradientLayer.ctx,
                    cx = 0,
                    cy = -260;

                radius = Math.sqrt(ctx.width * ctx.width + ctx.height * ctx.height) * 1.5;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.rect(0, 0, ctx.width, ctx.height);

                grd = ctx.createRadialGradient(cx, cy, radius * mod * 0.1, cx, cy, radius * mod);
                grd.addColorStop(0, 'hsl(197, 100%, 32%)');
                grd.addColorStop(1, 'hsl(197, 100%, 0%)');
                ctx.fillStyle = grd;
                ctx.fill();
                this.gradientLayerDirty = false;
                this.gradientLastY = this.position.y;
            }
        };

        BackgroundSystem.prototype.draw = function () {
            //this.drawSurface();
            this.drawNoise();
            this.drawLights();
            this.drawGradient();
        };

        BackgroundSystem.prototype.update = function (dt) {
            if (Math.abs(this.gradientLastY - this.position.y) > 100) {
                var i, n;
                this.gradientLayerDirty = true;
                this.gradientModifier = 1 / (this.position.y / 15000 + 1);

                for (i = 0, n = this.model.entities.length; i < n; i++) {
                    this.model.entities[i].ColorComponent.setShade(this.gradientModifier);
                }
            }
        };

        BackgroundSystem.prototype.resize = function () {
            this.noiseLayerDirty = true;
            this.lightLayerDirty = true;
            this.gradientLayerDirty = true;
        };

        BackgroundSystem.prototype.cameraSet = function (position) {
            var x = position.x,
                y = position.y;

            if (this.position.x !== x || this.position.y !== y) {
                this.position.x = x;
                this.position.y = y;
                this.position.ox = x * -1;
                this.position.oy = y * -1;
                this.noiseLayerDirty = true;
            }
        };

        return BackgroundSystem;

    }());

}(window));