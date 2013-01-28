(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.ModelList = (function () {

        /**
         * ModelList
         * A data structure for models.
         * A model an entity type defined by a combination of Components.
         * @param name
         * @param componentMap
         * @param engine
         * @return {*}
         * @constructor
         */

        function ModelList(name, componentMap, engine) {
            return ModelList.alloc(this, arguments);
        }
        app.inherit(app.BaseObj, ModelList);

        ModelList.prototype.init = function (modelName, componentMap, engine) {
            this.name = modelName;
            this.componentMap = componentMap;
            this.models = [];
            this.engine = engine;
            this.engine.bindEvent('componentAdded', this, this.componentAdded);
            this.engine.bindEvent('componentRemoved', this, this.componentRemoved);
            return this;
        };

        ModelList.prototype.deinit = function () {
            this.models.length = 0;
            this.engine.unbindEvent('componentAdded', this);
            this.engine.unbindEvent('componentRemoved', this);
        };

        /*** Entity Management ***/

        ModelList.prototype.componentAdded = function (entity) {
            var key, model;
            if (this.matchEntity(entity) && this.indexOfEntity(entity) === -1) {
                model = { entity: entity };
                for (key in this.componentMap) {
                    if (this.componentMap.hasOwnProperty(key)) {
                        model[key] = entity.components[this.componentMap[key]];
                    }
                }

                this.models.push(model);
                this.engine.triggerEvent(this.name + 'Added', model);
            }
        };

        ModelList.prototype.componentRemoved = function (entity) {
            var model, index = this.indexOfEntity(entity);
            if (index >= 0) {
                if (!this.matchEntity(entity)) {
                    model = this.models[index];
                    this.models.splice(index, 1);
                    this.engine.triggerEvent(this.name + 'Removed', model);
                }
            }
        };

        /*** Queries ***/

        ModelList.prototype.indexOfEntity = function (entity) {
            var i, n;
            for (i = 0, n = this.models.length; i < n; i++) {
                if (this.models[i].entity === entity) {
                    return i;
                }
            }
            return -1;
        };

        ModelList.prototype.matchEntity = function (entity) {
            var key, componentNames = this.componentMap;
            for (key in componentNames) {
                if (componentNames.hasOwnProperty(key)) {
                    if (!entity.components[componentNames[key]]) {
                        return false;
                    }
                }
            }
            return true;
        };

        ModelList.prototype.matchComponent = function (componentName) {
            var key, componentNames = this.componentMap;
            for (key in componentNames) {
                if (componentNames.hasOwnProperty(key) &&
                        componentNames[key] === componentName) {
                    return true;
                }
            }
            return false;
        };

        return ModelList;

    }());

}(window));