(function (global) {
    'use strict';

    global.app = global.app || {};


    global.app.Model = (function () {

        /**
         * Model
         * @return {*}
         * @constructor
         */

        function Model(system, components, addedCallback, removedCallback) {
            return Model.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Model);


        Model.prototype.init = function (system, components, addedCallback, removedCallback) {
            app.assert(system instanceof app.System);
            app.assert(components instanceof Array);
            this.system = system;
            this.components = components;
            this.addedCallback = addedCallback;
            this.removedCallback = removedCallback;
            this.system.engine.bindEvent('componentAdded', this);
            this.system.engine.bindEvent('componentRemoved', this);
            this.entities = [];
            return this;
        };

        Model.prototype.deinit = function () {
            this.entities.length = 0;
            this.system.engine.unbindEvent('componentAdded', this);
            this.system.engine.unbindEvent('componentRemoved', this);
        };

        Model.prototype.componentAdded = function (entity) {
            if (this.matchEntity(entity)) {
                if (this.indexOfEntity(entity) === -1) {
                    this.entities.push(entity);
                    if (this.addedCallback) {
                        this.addedCallback.call(this.system, entity);
                    }
                }
            }
        };

        Model.prototype.componentRemoved = function (entity) {
            var i =  this.indexOfEntity(entity);
            if (i > -1) {
                if (!this.matchEntity(entity)) {
                    this.splice(i, 1);
                    if (this.removedCallback) {
                        this.removedCallback.call(this.system, entity);
                    }
                }
            }
        };

        Model.prototype.indexOfEntity = function (entity) {
            var i, n;
            for (i = 0, n = this.entities.length; i < n; i++) {
                if (this.entities[i] === entity) {
                    return i;
                }
            }
            return -1;
        };

        Model.prototype.matchEntity = function (entity) {
            var i, n;
            for (i = 0, n = this.components.length; i < n; i += 1) {
                if (!entity[this.components[i]]) {
                    return false;
                }
            }
            return true;
        };

        return Model;

    }());
}(window));