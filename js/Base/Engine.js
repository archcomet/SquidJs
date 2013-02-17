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
            this.componentEntities = {};
            this.systems = {};
            this.eventListeners = {};
            this.state = {};

            this.container = options.container;
            this.setting = new app.Settings(options.settings);

            this.canvas = new app.Canvas({
                container: this.container,
                zIndex: 0,
                engine: this,
                cameraRate: 1
            });

            this.canvasDirty = false;
            this.bindEvent('draw', this.canvas);

            if (_.isArray(options.systems)) {
                for (i = 0, n = options.systems.length; i < n; i += 1) {
                    this.createSystem(options.systems[i], i);
                }
            }

            this.timer = new app.Timer({
                engine: this
            });

            $(window).resize(function () {
                self.triggerEvent('resize');
            });

            this.setting.disableDebug = this.disableDebug.bind(this);
            this.enableDebug();

            return this;
        };

        Engine.prototype.deinit = function () {
            this.stop();
            return this;
        };

        /*** Entity Management ****/

        Engine.prototype.addEntity = function (entity) {
            entity.engine = this;
            this.entities[entity.id] = entity;

            var zOrder, key, entityArray;
            for (key in entity) {
                if (entity.hasOwnProperty(key) && entity[key] instanceof app.Component) {
                    entityArray = this.componentEntities[key];
                    if (entityArray === undefined) {
                        entityArray = this.componentEntities[key] = [];
                    }
                    entityArray.push(entity);
                }
            }

            if (entity.node !== undefined) {
                if (entity.PositionComponent !== undefined) {
                    zOrder = entity.PositionComponent.zOrder;
                }
                this.canvas.addChild(entity.node, zOrder);
            }

            this.triggerEvent('entityAdded', entity);
            return this;
        };

        Engine.prototype.removeEntity = function (entity) {
            var i, n, key, entityArray;

            this.triggerEvent('entityRemoved', entity);

            if (entity.node !== undefined) {
                this.canvas.removeChild(entity.node);
            }

            for (key in entity) {
                if (entity.hasOwnProperty(key) && entity[key] instanceof app.Component) {
                    entityArray = this.componentEntities[key];
                    for (i = 0, n = entityArray.length; i < n; i += 1) {
                        if (entityArray[i] === entity) {
                            entityArray.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            delete this.entities[entity.id];
            return this;
        };

        Engine.prototype.entitiesForComponent = function (componentName) {
            var entities = this.componentEntities[componentName];
            return (entities === undefined) ? [] : entities;
        };

        /*** System Management ****/

        Engine.prototype.createSystem = function (systemName, priority) {
            var system = this.systems[systemName];
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
                system.destroy();
            }
            return this;
        };

        /*** Events ***/

        Engine.prototype.bindEvent = function (event, target, priority) {
            var listener, listeners = this.eventListeners[event];
            if (!listeners) {
                this.eventListeners[event] = listeners = [];
            }

            listener = target[event].bind(target);
            listener.target = target;
            listener.priority = priority || target.priority || Infinity;
            listeners.push(listener);

            _.sortBy(listeners, function (listener) { return listener.priority; });
            return this;
        };

        Engine.prototype.unbindEvent = function (event, target) {
            var i, n, listeners = this.eventListeners[event];
            for (i = 0, n = listeners.length; i < n; i += 1) {
                if (listeners[i].target === target) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
            return this;
        };

        Engine.prototype.triggerEvent = function (event) {
            var i, n, listener, listeners, args;
            listeners = this.eventListeners[event];
            if (listeners !== undefined && listeners.length > 0) {
                args = Array.prototype.slice.call(arguments);
                args.splice(0, 1);
                for (i = 0, n = listeners.length; i < n; i += 1) {
                    listener = listeners[i];
                    listener.apply(listener, args);
                }
            }
            return this;
        };

        /**** Timer ****/

        Engine.prototype.start = function () {
            this.timer.start();
            return this;
        };

        Engine.prototype.stop = function () {
            this.timer.stop();
            return this;
        };

        Engine.prototype.update = function (dt) {
            this.triggerEvent('update', dt);
            this.canvasDirty = true;
            return this;
        };

        Engine.prototype.draw = function () {
            if (this.canvasDirty) {
                this.triggerEvent('draw');
                this.canvasDirty = false;
            }
            return this;
        };

        /*** Debug ***/

        Engine.prototype.enableDebug = function () {
            this.timer.enableStats();
            this.setting.enableDebugControl();
        };

        Engine.prototype.disableDebug = function () {
            this.timer.disableStats();
            this.setting.disableDebugControl();
        };

        return Engine;

    }());

}(window));