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
            options = options || {};

            // Lists
            this.entities = {};
            this.componentEntities = {};
            this.eventListeners = {};
            this.systems = {};
            this.factories = {};
            this.stage = {};

            // State
            this.canvasDirty = false;
            this.container = options.container;
            this.inputContainer = options.inputContainer;
            this.settings = new app.Settings(options.settings);

            // Entity Canvas
            this.canvas = new app.Canvas({
                container: this.container,
                zIndex: 0,
                engine: this,
                cameraRate: 1
            });

            // Main Timer
            this.timer = new app.Timer({
                engine: this
            });

            // Systems & Factories
            this.createSystems(options.systems);
            this.createFactories(options.factories);

            // Event Bindings
            $(window).resize(this.triggerEvent.bind(this, 'resize'));
            this.bindEvent('draw', this.canvas);

            // Debug functions
            this.settings.disableDebug = this.disableDebug.bind(this);

            return this;
        };

        Engine.prototype.deinit = function () {
            this.stop();
            this.destroyFactories();
            this.destroySystems();
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
            if (system === undefined) {
                system = new app.System[systemName](this);
                system.priority = priority;
                this.systems[systemName] = system;

                if (system.settings !== undefined) {
                    this.settings[systemName] = system.settings;
                }
            }
            return system;
        };

        Engine.prototype.createSystems = function (systemNames) {
            var i, n;
            for (i = 0, n = systemNames.length; i < n; i += 1) {
                this.createSystem(systemNames[i], i);
            }
            return this;
        };

        Engine.prototype.destroySystem = function (systemName) {
            var system = this.systems[systemName];
            if (system !== undefined) {
                delete this.systems[systemName];
                system.destroy();
            }
            return this;
        };

        Engine.prototype.destroySystems = function () {
            var key;
            for (key in this.systems) {
                if (this.systems.hasOwnProperty(key)) {
                    this.destroySystem(key);
                }
            }
            return this;
        };

        /*** Factories ***/

        Engine.prototype.createFactory = function (factoryName) {
            var factory = this.factories[factoryName];
            if (factory === undefined) {
                factory = new app.Factory[factoryName](this);
                this.factories[factoryName] = factory;
                if (this.settings[factoryName] === undefined) {
                    this.settings[factoryName] = {};
                }
                this.settings[factoryName] = factory.settings;
            }
            return factory;
        };

        Engine.prototype.createFactories = function (factoryNames) {
            var i, n;
            for (i = 0, n = factoryNames.length; i < n; i += 1) {
                this.createFactory(factoryNames[i]);
            }
        };

        Engine.prototype.destroyFactory = function (factoryName) {
            var factory = this.factories[factoryName];
            if (factory !== undefined) {
                delete this.settings[factoryName];
                delete this.factories[factoryName];
                factory.destroy();
            }
        };

        Engine.prototype.destroyFactories = function () {
            var key;
            for (key in this.factories) {
                if (this.factories.hasOwnProperty(key)) {
                    this.destroyFactory(key);
                }
            }
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
            this.settings.enableDebugControl();
        };

        Engine.prototype.disableDebug = function () {
            this.timer.disableStats();
            this.settings.disableDebugControl();
        };

        return Engine;

    }());

}(window));