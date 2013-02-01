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
            this.modelList = this.engine.createModelList('colors', {
                color: 'ColorComponent'
            });

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
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('draw', this);
            this.engine.unbindEvent('cameraSet', this);
            this.engine.unbindEvent('resize', this);
        };

        BackgroundSystem.prototype.createCanvases = function () {

            this.noiseBuffer = new app.Canvas({
                engine: this.engine,
                width: this.image.width,
                height: this.image.height,
                fullscreen: false
            });

            this.noiseLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -1,
                engine: this.engine
            });

            this.lightLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -2,
                engine: this.engine
            });

            this.gradientLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -3,
                engine: this.engine
            });

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('draw', this);
            this.engine.bindEvent('cameraSet', this);
            this.engine.bindEvent('resize', this);
        };

        BackgroundSystem.prototype.drawNoiseBuffer = function () {
            var w = this.image.width,
                h = this.image.height,
                ctx = this.noiseBuffer.ctx;
            ctx.clearRect(0, 0, ctx.width, ctx.height);
            ctx.drawImage(this.image, this.position.ox, this.position.oy);
            ctx.drawImage(this.image, this.position.ox + w, this.position.oy);
            ctx.drawImage(this.image, this.position.ox + w, this.position.oy + h);
            ctx.drawImage(this.image, this.position.ox, this.position.oy + h);
        };

        BackgroundSystem.prototype.drawNoise = function () {
            if (this.noiseLayerDirty) {
                this.drawNoiseBuffer();
                var ctx = this.noiseLayer.ctx;
                ctx.globalAlpha = 0.9;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.fillStyle = ctx.createPattern(this.noiseBuffer.ctx.canvas, 'repeat');
                ctx.fillRect(0, 0, ctx.width, ctx.height);
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
                    x1: 80,
                    y1: 0,
                    x2: 400,
                    y2: 1000,
                    topRadius: 6,
                    bottomRadius: 40
                });

                this.drawLight({
                    x1: 160,
                    y1: 0,
                    x2: 800,
                    y2: 900,
                    topRadius: 8,
                    bottomRadius: 45
                });

                this.drawLight({
                    x1: 250,
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
            this.drawNoise();
            this.drawLights();
            this.drawGradient();
        };

        BackgroundSystem.prototype.update = function (dt) {
            if (Math.abs(this.gradientLastY - this.position.y) > 100) {
                var i, n, models = this.modelList.models;
                this.gradientLayerDirty = true;
                this.gradientModifier = 1 / (this.position.y / 15000 + 1);

                for (i = 0, n = models.length; i < n; i++) {
                    models[i].color.setShade(this.gradientModifier);
                }
            }
        };

        BackgroundSystem.prototype.resize = function () {
            this.noiseLayerDirty = true;
            this.lightLayerDirty = true;
            this.gradientLayerDirty = true;
        };

        BackgroundSystem.prototype.cameraSet = function (position) {
            var x = position.x * 0.4,
                y = position.y * 0.4,
                w = this.image.width,
                h = this.image.height;

            if (this.position.x !== x || this.position.y !== y) {
                this.position.x = x;
                this.position.y = y;
                this.position.ox = (x - Math.floor(x / w) * w) * -1;
                this.position.oy = (y - Math.floor(y / h) * h) * -1;
                this.noiseLayerDirty = true;
            }
        };

        return BackgroundSystem;

    }());

}(window));