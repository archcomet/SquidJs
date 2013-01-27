(function (global) {
    "use strict";

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

        BackgroundSystem.prototype.deinit = function () {
            this.engine.unbindEvent('draw', this.canvas);
            this.engine.unbindEvent('cameraSet', this);
        };

        BackgroundSystem.prototype.init = function () {

            this.position = {
                x: 0,
                y: 0,
                ox: 0,
                oy: 0
            };

            this.dirty = true;
            this.image = new Image();
            this.image.src = 'images/backgroundNoise.png';
            this.image.onload = this.onload.bind(this);

            return this;
        };

        BackgroundSystem.prototype.onload = function () {

            this.noiseBuffer = new app.Canvas({
                engine: this.engine,
                width: this.image.width,
                height: this.image.height,
                fullscreen: false
            });

            this.noiseLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -1,
                engine: this
            });

            this.gradientBuffer = new app.Canvas({
                container: this.engine.container,
                zIndex: -2,
                engine: this
            });

            this.gradientLayer = new app.Canvas({
                container: this.engine.container,
                zIndex: -3,
                engine: this
            });

            //todo use resize event
            $(window).resize(this.drawGradient.bind(this));
            $(window).resize(this.drawLights.bind(this));
            this.engine.bindEvent('windowResize', this, this.drawLights);
            this.engine.bindEvent('windowResize', this, this.drawGradient);

            this.drawLights();
            this.drawGradient();
            this.engine.bindEvent('draw', this, this.drawNoise);
            this.engine.bindEvent('cameraSet', this, this.cameraSet);
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
                this.dirty = true;
            }
        };

        BackgroundSystem.prototype.updateNoiseBuffer = function () {
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
            if (this.dirty) {
                this.updateNoiseBuffer();
                var ctx = this.noiseLayer.ctx;
                ctx.globalAlpha = 0.75;
                ctx.clearRect(0, 0, ctx.width, ctx.height);
                ctx.fillStyle = ctx.createPattern(this.noiseBuffer.ctx.canvas, 'repeat');
                ctx.fillRect(0, 0, ctx.width, ctx.height);
                this.dirty = false;
            }
        };

        BackgroundSystem.prototype.drawLight = function (data) {
            var i, grd, ctx = this.gradientBuffer.ctx;

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
        };

        BackgroundSystem.prototype.drawGradient = function () {
            var grd, ctx = this.gradientLayer.ctx,
                cx = 0,
                cy = -260,
                radius = Math.sqrt(ctx.width * ctx.width + ctx.height * ctx.height);

            ctx.clearRect(0, 0, ctx.width, ctx.height);
            ctx.rect(0, 0, ctx.width, ctx.height);
            grd = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 0.7);
            grd.addColorStop(0, 'hsl(197, 100%, 32%)');
            grd.addColorStop(1, 'hsl(197, 100%, 0%)');

            ctx.fillStyle = grd;
            ctx.fill();
        };

        return BackgroundSystem;

    }());

}(window));