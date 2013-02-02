(function (global) {
    'use strict';

    // Object.create polyfill for older browsers to make them more ES5 like
    if (!Object.create) {
        /**
         * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create/
         */
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw new Error('Object.create implementation only accepts the first parameter.');
            }
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    global.app = global.app || {};

    /**
     * inherit
     * Function to setup psuedo classical inheritance for an object.
     * @param parent
     * @param target
     * @return {*}
     */
    global.app.inherit = function (parent, target) {

        target.prototype = Object.create(parent.prototype);
        target.prototype.constructor = target;
        target.parent = parent.prototype;

        target.alloc = function (thisArg, argArray) {
            return parent.prototype.constructor.apply(thisArg, argArray);
        };

        return target;
    };

    global.app.BaseObj = (function () {

        /**
         * BaseObj
         * Base object for psuedo classical inheritance.
         * @return {*}
         * @constructor
         */

        function BaseObj() {
            if (!(this instanceof BaseObj)) {
                throw 'Constructor called without using keyword new.';
            }
            return this.init.apply(this, arguments);
        }

        BaseObj.prototype.init = function () {
            return this;
        };

        BaseObj.prototype.deinit = function () {
            return this;
        };

        BaseObj.prototype.destroy = function () {
            var property;
            this.deinit();
            for (property in this) {
                if (this.hasOwnProperty(property)) {
                    delete this[property];
                }
            }
            return this;
        };

        return BaseObj;

    }());

}(window));