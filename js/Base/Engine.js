(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Engine = (function () {

        /**
         * Engine
         * @param options
         * @return {*}
         * @constructor
         */

        function Engine(options) {
            return Engine.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, Engine);


        Engine.prototype.init = function (options) {
            var i, n, self = this;

            options = options || {};

            this.entities = {};
            this.modelLists = {};
            this.systems = {};
            this.eventListeners = {};
            this.container = options.container;

            this.canvas = new app.Canvas({
                container: this.container,
                zIndex: 0,
                engine: this,
                cameraRate: 1
            });

            this.bindEvent('draw', this.canvas, this.canvas.draw);

            if (_.isArray(options.systems)) {
                for (i = 0, n = options.systems.length; i < n; i++) {
                    this.createSystem(options.systems[i], i);
                }
            }

            this.timer = new app.Timer({
                autostart: false,
                engine: this
            });

            this.timer.schedule(function () {
                self.triggerEvent('update');
                self.triggerEvent('draw');
            }, 0, 1);

            $(window).resize(function () {
                self.triggerEvent('resize');
            });

            return this;
        };

        Engine.prototype.deinit = function () {
        };

        /*** Entity Management ****/

        Engine.prototype.createEntity = function (options) {
            options = options || {};
            options.tag = options.tag || 'entity_';
            options.components = options.components || {};

            var entity = new app.Entity(options.tag);
            entity.engine = this;
            entity.createComponents(options.components);
            this.entities[entity.id] = entity;
            return entity;
        };

        Engine.prototype.destroyEntity = function (entityId) {
            var entity = this.entities[entityId];
            delete this.entities[entityId];
            app.Entity.destroy(entity);
        };

        Engine.prototype.entityForTag = function (entityId) {
            return this.entities[entityId];
        };

        /*** Model Management ***/

        Engine.prototype.createModelList = function (modelName, componentMap) {
            var modelList = this.modelLists[modelName];
            if (!modelList) {
                modelList = new app.ModelList(modelName, componentMap, this);
                this.modelLists[modelName] = modelList;
                _.each(this.entities, function (entity) {
                    modelList.addEntity(entity);
                });
            }
            return modelList;
        };

        Engine.prototype.destroyModelList = function (modelName) {
            var modelList = this.modelLists[modelName];
            delete this.modelLists[modelName];
            app.ModelList.destroy(modelList);
        };

        /*** System Management ****/

        Engine.prototype.createSystem = function (systemName, priority) {
            var self = this,
                system = this.systems[systemName];
            if (!system) {
                system = new app.System[systemName](this);
                system.priority = priority;
                this.systems[systemName] = system;
            }
            return system;
        };

        Engine.prototype.destroySystem = function (systemName) {
            var system = this.systems[systemName];
            if (system) {
                delete this.systems[systemName];
                app.System[systemName].destroy(system);
            }
        };

        /*** Events ***/

        Engine.prototype.bindEvent = function (event, target, callback, priority) {
            var listener, listeners = this.eventListeners[event];
            if (!listeners) {
                this.eventListeners[event] = listeners = [];
            }

            listener = callback.bind(target);
            listener.target = target;
            listener.priority = priority || target.priority || Infinity;
            listeners.push(listener);

            _.sortBy(listeners, function (callback) { return callback.priority; });
        };

        Engine.prototype.unbindEvent = function (event, target) {
            var i, n, listeners = this.eventListeners[event];
            for (i = 0, n = listeners.length; i < n; i++) {
                if (listeners[i].target === target) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };

        Engine.prototype.triggerEvent = function (event) {
            var i, n, listener, listeners, args;
            listeners = this.eventListeners[event];
            if (listeners && listeners.length > 0) {
                args = Array.prototype.slice.call(arguments);
                args.splice(0, 1);
                for (i = 0, n = listeners.length; i < n; i++) {
                    listener = listeners[i];
                    listener.apply(listener, args);
                }
            }
        };

        /**** Timer ****/

        Engine.prototype.start = function () {
            this.timer.start();
        };

        Engine.prototype.stop = function () {
            this.timer.stop();
        };

        return Engine;

    }());

}(window));