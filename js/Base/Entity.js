(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Entity = (function () {

        /**
         * Entity
         * Basic Game Object. Contains components.
         * @param options
         * @return {*}
         * @constructor
         */

        function Entity(options) {
            return Entity.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Entity);

        Entity.prototype.init = function (options) {
            this.id = _.uniqueId(options.tag || 'entity_');
            this.contactListeners = {};
            this.createComponents(options.components);
            this.node = this.createNodes(options.nodes);
            return this;
        };

        Entity.prototype.deinit = function () {
            this.unbindAllContactEvents();
            this.destroyAllComponents();
            this.destroyNodes(this.node);
            return this;
        };

        /*** Component Management ***/

        Entity.prototype.createComponents = function (components) {
            var component, componentName, componentOptions;
            for (componentName in components) {
                if (components.hasOwnProperty(componentName)) {
                    componentOptions = components[componentName];
                    component = new app.Component[componentName](componentOptions);
                    this[componentName] = component;
                }
            }
        };

        Entity.prototype.destroyAllComponents = function () {
            var key;
            for (key in this) {
                if (this.hasOwnProperty(key) && this[key] instanceof app.Component) {
                    this[key].destroy();
                    delete this[key];
                }
            }
        };

        /*** Contact Listener Management ***/

        Entity.prototype.bindContactEvent = function (event, target) {
            var listener, listeners = this.contactListeners[event];
            if (!listeners) {
                this.contactListeners[event] = listeners = [];
            }

            listener = target[event].bind(target);
            listener.target = target;
            listeners.push(listener);
        };

        Entity.prototype.unbindContactEvent = function (event, target) {
            var i, n, listeners = this.contactListeners[event];
            for (i = 0, n = listeners.length; i < n; i += 1) {
                if (listeners[i].target === target) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };

        Entity.prototype.unbindAllContactEvents = function () {
            var key;
            for (key in this.contactListeners) {
                if (this.contactListeners.hasOwnProperty(key)) {
                    this.contactListeners[key].length = 0;
                }
            }
        };

        Entity.prototype.triggerContactEvent = function (event) {
            var i, n, listener, listeners, args;
            listeners = this.contactListeners[event];
            if (listeners !== undefined && listeners.length > 0) {
                args = Array.prototype.slice.call(arguments);
                args.splice(0, 1);
                for (i = 0, n = listeners.length; i < n; i += 1) {
                    listener = listeners[i];
                    listener.apply(listener, args);
                }
            }
        };

        /*** Node Management ***/

        Entity.prototype.createNodes = function (nodes, parent) {
            var key, child, node;
            if (nodes !== undefined) {
                if (parent === undefined) {
                    parent = new app.DrawNode();
                    parent.autotransform = false;
                }
                for (key in nodes) {
                    if (nodes.hasOwnProperty(key)) {
                        node = nodes[key];
                        child = new app.DrawNode[key](this);
                        parent.addChild(child, node.zOrder);
                        if (node.nodes !== undefined) {
                            this.createNodes(node.nodes, child);
                        }
                    }
                }
            }
            return parent;
        };

        Entity.prototype.destroyNodes = function (node) {

        };

        return Entity;

    }());

}(window));