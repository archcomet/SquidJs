(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.FoodSystem = (function () {

        /**
         * FoodSystem
         * @return {FoodSystem}
         * @constructor
         */

        function FoodSystem(engine) {
            return FoodSystem.alloc(this, arguments);
        }

        app.inherit(app.System, FoodSystem);


        FoodSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);
            return this;
        };

        FoodSystem.prototype.deinit = function () {
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);
            this.engine.unbindEvent('update', this);
        };

        /*** System Update ***/

        FoodSystem.prototype.update = function (dt) {
            var i, n, entity,
                entities = this.engine.entitiesForComponent('FoodComponent'),
                foodToRemove = [];

            for (i = 0, n = entities.length; i < n; i += 1) {
                entity = entities[i];
                if (entity.FoodComponent.collectedBy === undefined) {
                    entity.FoodComponent.duration -= 1;
                } else {
                    entity.FoodComponent.collectedBy.SquidComponent.foodCollected += 1;
                    entity.FoodComponent.duration = 0;
                }
                if (entity.FoodComponent.duration === 0) {
                    foodToRemove.push(entity);
                }
            }

            for (i = 0, n = foodToRemove.length; i < n; i += 1) {
                this.engine.foodFactory.destroyFood(foodToRemove[i]);
            }
        };

        /*** Entity Events ***/

        FoodSystem.prototype.entityAdded = function (entity) {
            if (entity.FoodComponent !== undefined) {
                entity.bindContactEvent('preSolve', this);
            }
        };

        FoodSystem.prototype.entityRemoved = function (entity) {
            if (entity.FoodComponent !== undefined) {
                entity.unbindContactEvent('preSolve', this);
            }
        };

        FoodSystem.prototype.preSolve = function (entity, contactee, contact, oldManifold) {
            if (entity.FoodComponent.duration < 860 && contactee.SquidComponent !== undefined) {
                if (entity.FoodComponent.collectBy === undefined) {
                    entity.FoodComponent.collectedBy = contactee;
                }
                contact.SetEnabled(false);
            }
        };

        return FoodSystem;

    }());

}(window));