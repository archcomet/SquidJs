(function (global) {
    'use strict';

    /**
     * A robust requestAnimationFrame polyfill by Erik Möller
     * Fixes from Paul Irish and Tino Zijdel
     * Modified to pass jslint
     *
     * https://gist.github.com/paulirish/1579671
     */

    (function () {
        var i, n, lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'];
        for (i = 0, n = vendors.length; i < n && !window.requestAnimationFrame; i += 1) {
            window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());


    global.app = global.app || {};

    global.app.Timer = (function () {

        /**
         * Timer
         * @param options
         * @return {*}
         * @constructor
         */

        function Timer(options) {
            return Timer.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, Timer);

        Timer.prototype.init = function (options) {
            _.defaults(this, options, {
                engine: undefined,
                fps: 60
            });

            this.enableFrameSkip = false;
            this.interval = 1 / this.fps;
            this.counter = 0;
            this.loops = 0;
            this.skipTicks = 1000 / this.fps;
            this.maxFrameSkip = 10;
            this.nextGameTick = (new Date()).getTime();

            return this;
        };

        Timer.prototype.start = function () {
            this.animationFrame = window.requestAnimationFrame(this.step.bind(this));
        };

        Timer.prototype.stop = function () {
            window.cancelAnimationFrame(this.animationFrame);
        };

        Timer.prototype.step = function () {

            var dt = (new Date()).getTime() - this.nextGameTick;
            this.enableFrameSkip = (dt > this.skipTicks * 3 && dt < 1000);

            if (this.enableFrameSkip) {
                this.loops = 0;
                while ((new Date()).getTime() > this.nextGameTick && this.loops < this.maxFrameSkip) {
                    this.engine.update(this.interval);
                    this.nextGameTick += this.skipTicks;
                    this.loops += 1;
                }
            } else {
                this.engine.update(this.interval);
                this.nextGameTick = (new Date()).getTime() + this.skipTicks;
            }

            this.engine.draw();
            this.counter += 1;
            this.animationFrame = window.requestAnimationFrame(this.step.bind(this));
        };

        return Timer;

    }());

}(window));





