(function (global) {
    'use strict';

    /**
     * requestAnimationFrame polyfill by Erik Möller
     * Fixes from Paul Irish and Tino Zijdel
     *
     * @see http://goo.gl/ZC1Lm
     * @see http://goo.gl/X0h6k
     */

    (function(){for(var d=0,a=["ms","moz","webkit","o"],b=0;b<a.length&&!window.requestAnimationFrame;++b)window.requestAnimationFrame=window[a[b]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[a[b]+"CancelAnimationFrame"]||window[a[b]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var a=Date.now(),c=Math.max(0,16-(a-d)),e=window.setTimeout(function(){b(a+c)},c);d=a+c;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})})();

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
                autostart: true,
                engine: undefined
            });

            this.counter = 0;
            this.millis = 0;
            this.timeout = undefined;
            this.schedules = [];

            if (this.autostart) {
                this.step();
            }

            return this;
        };

        Timer.prototype.start = function () {
            var self = this;
            this.now = Date.now();
            this.timeout = requestAnimationFrame(function () {
                self.step();
            });
        };

        Timer.prototype.stop = function () {
            cancelAnimationFrame(this.timeout);
        };

        Timer.prototype.step = function (now) {
            var i, n, self = this;
            this.dt = (now = now || Date.now()) - this.now;
            this.millis += this.dt;
            this.now = now;

            for (i = 0, n = this.schedules.length; i < n; i++) {
                if (this.counter % this.schedules[i].interval === 0) {
                    this.schedules[i](this.dt);
                }
            }

            this.counter += 1;
            this.timeout = requestAnimationFrame(function () {
                self.step();
            });
        };

        Timer.prototype.schedule = function (callback, priority, interval) {
            callback.priority = priority;
            callback.interval = interval;
            callback.id = _.uniqueId();
            this.schedules.push(callback);
            _.sortBy(this.schedules, function (item) {
                return item.priority;
            });
            return callback.id;
        };

        Timer.prototype.unschedule = function(id) {
            var i, n;
            for (i = 0, n = this.schedules.length; i < n; i++) {
                if (this.schedules[i].id === id) {
                    this.schedulers.splice(i, 1);
                    return;
                }
            }
        };

        Timer.prototype.unscheduleAll = function() {
            this.schedules.length = 0;
        };

        return Timer;

    }());

}(window));





