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
            this.position = {
                x: 0,
                y: 0,
                ox: 0,
                oy: 0,
                current: 0
            };

            this.noiseLayerDirty = true;
            this.lightLayerDirty = true;
            this.gradientLayerDirty = true;
            this.gradientLastY = undefined;
            this.gradientModifier = 1;
            this.image = new Image();
            this.image.src = 'images/backgroundNoise.png';
            this.image.onload = this.initCanvases.bind(this);

            return this;
        };

        BackgroundSystem.prototype.initCanvases = function () {

            this.waveBuffer = new app.Canvas({
                fullscreen: false,
                width: 200,
                height: 45,
                zIndex: 1,
                engine: this.engine
            });

            this.skyLayer = new app.Canvas({
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

            this.initNoiseLayer();
            this.initWaveBuffer();
            this.initSkyLayer();

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('draw', this);
            this.engine.bindEvent('cameraSet', this);
            this.engine.bindEvent('resize', this);
        };

        BackgroundSystem.prototype.initNoiseLayer = function () {
            this.noiseLayer.ctx.fillStyle = this.noiseLayer.ctx.createPattern(this.image, 'repeat');
            this.noiseLayer.ctx.globalALpha = 0.7;
        };

        BackgroundSystem.prototype.initWaveBuffer = function () {
            var ctx = this.waveBuffer.ctx;
            ctx.strokeStyle = 'hsl(197, 100%, 100%)';
            ctx.fillStyle = 'hsl(197, 100%, 22%)';
            ctx.lineWidth = 4.0;
            ctx.beginPath();
            ctx.moveTo(0, 2);
            ctx.bezierCurveTo(60, 22, 140, 22, 200, 2);
            ctx.stroke();
            ctx.lineTo(200, 22);
            ctx.bezierCurveTo(140, 42, 60, 42, 0, 22);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            this.wavePattern = ctx.createPattern(this.waveBuffer.ctx.canvas, 'repeat');
        };

        BackgroundSystem.prototype.initSkyLayer = function () {
            var ctx = this.skyLayer.ctx;
            this.skyFill = ctx.createRadialGradient(173, 70, 50, 173, 70, 1400);
            this.skyFill.addColorStop(0.0, 'hsl(44, 100%, 62%)');
            this.skyFill.addColorStop(0.004, 'hsl(44, 100%, 92%)');
            this.skyFill.addColorStop(0.01, 'hsl(26, 74%, 62%)');
            this.skyFill.addColorStop(1.0, 'hsl(289, 54%, 12%)');
        };

        BackgroundSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('draw', this);
            this.engine.unbindEvent('cameraSet', this);
            this.engine.unbindEvent('resize', this);
        };

        BackgroundSystem.prototype.update = function (dt) {
            this.current += 1;
            if (Math.abs(this.gradientLastY - this.position.y) > 100) {
                var i, n, entityArray;
                this.gradientLayerDirty = true;
                this.gradientModifier = 1 / (this.position.y / 15000 + 1);

                entityArray = this.engine.entitiesForComponent('ColorComponent');
                for (i = 0, n = entityArray.length; i < n; i += 1) {
                    entityArray[i].ColorComponent.setShade(this.gradientModifier);
                }
            }
        };

        BackgroundSystem.prototype.drawSky = function () {
            var x, ctx = this.skyLayer.ctx,
                surface = b2.toPixels(b2.WATERLEVEL) + ctx.height / 2,
                y = surface - this.position.y;
            ctx.clearRect(0, 0, ctx.width, ctx.height);
            if (y > 0) {
                ctx.fillStyle = this.skyFill;
                ctx.fillRect(0, 0, ctx.width, y);
            }

            if (y > -20) {
                x = this.position.ox + this.engine.timer.counter * 0.75;
                ctx.fillStyle = this.wavePattern;
                ctx.translate(x, y - 21);
                ctx.fillRect(-x, 0, ctx.width, 42);
                ctx.translate(-x, -y + 21);
            }
        };

        BackgroundSystem.prototype.drawNoise = function () {
            if (this.noiseLayerDirty) {
                var x1 = this.position.ox,
                    y1 = this.position.oy,
                    ctx = this.noiseLayer.ctx;

                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.globalALpha = 0.3;
                ctx.translate(x1, y1);
                ctx.fillRect(-x1, -y1, ctx.width, ctx.height);
                ctx.translate(-x1, -y1);

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

            for (i = 1; i < 4; i += 1) {
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
                    x1: 140,
                    y1: 0,
                    x2: 800,
                    y2: 900,
                    topRadius: 8,
                    bottomRadius: 45
                });

                this.drawLight({
                    x1: 210,
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
            this.drawSky();
            this.drawNoise();
            this.drawLights();
            this.drawGradient();
        };

        BackgroundSystem.prototype.resize = function () {
            this.noiseLayerDirty = true;
            this.lightLayerDirty = true;
            this.gradientLayerDirty = true;
            this.initNoiseLayer();
            this.initWaveBuffer();
            this.initSkyLayer();
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