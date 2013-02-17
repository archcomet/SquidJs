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

            this.interval = 1 / this.fps;
            this.updatesToPerform = 1;
            this.lastFrame = 0;
            this.counter = 0;

            return this;
        };

        /*** Start & Stop ***/

        Timer.prototype.start = function () {
            this.lastFrame = Date.now();
            this.animationFrame = window.requestAnimationFrame(this.step.bind(this));
        };

        Timer.prototype.stop = function () {
            window.cancelAnimationFrame(this.animationFrame);
        };

        /*** Step ***/

        Timer.prototype.step = function () {
            this.preUpdate();

            while (this.updatesToPerform > 0) {
                this.engine.update(this.interval);
                this.updatesToPerform -= 1;
                this.counter += 1;
            }

            this.engine.draw();

            this.postUpdate();
            this.animationFrame = window.requestAnimationFrame(this.step.bind(this));
        };

        Timer.prototype.preUpdate = function () {
            this.dt = Date.now() - this.lastFrame;

            if (this.dt < 18) {
                this.updatesToPerform = 1;
            } else if (this.dt < 35) {
                this.updatesToPerform = 2;
            } else if (this.dt < 45) {
                this.updatesToPerform = 3;
            } else {
                this.updatesToPerform = 4;
            }

            if (this.stats !== undefined) {
                this.stats.end();
                this.stats.begin();
            }

            if (this.codeStats !== undefined) {
                this.codeStats.begin();
            }
        };

        Timer.prototype.postUpdate = function () {
            if (this.codeStats !== undefined) {
                this.codeStats.end();
            }
            this.lastFrame = Date.now();
        };

        /*** Debug ***/

        Timer.prototype.enableStats = function () {
            this.stats = new global.Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';

            this.codeStats = new global.Stats();
            this.codeStats.setMode(1);
            this.codeStats.domElement.style.position = 'absolute';
            this.codeStats.domElement.style.left = '80px';
            this.codeStats.domElement.style.top = '0px';

            document.body.appendChild(this.stats.domElement);
            document.body.appendChild(this.codeStats.domElement);
        };

        Timer.prototype.disableStats = function () {
            document.body.removeChild(this.stats.domElement);
            document.body.removeChild(this.codeStats.domElement);

            this.stats = undefined;
            this.codeStats = undefined;
        };

        return Timer;

    }());

}(window));





