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
            return this;
        };

        FoodSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        /*** System Update ***/

        FoodSystem.prototype.update = function (dt) {
            var i, n, j, m, entity, contact,
                entities = this.engine.entitiesForComponent('FoodComponent'),
                foodToRemove = [];

            for (i = 0, n = entities.length; i < n; i += 1) {
                entity = entities[i];
                for (j = 0, m = entity.PhysicsComponent.contacts.length; j < m; j += 1) {
                    contact = entity.PhysicsComponent.contacts[j];
                    if (contact.contactee.SquidPlayerComponent !== undefined) {
                        break;
                    } else {
                        contact = undefined;
                    }
                }

                if (contact !== undefined) {
                    this.engine.factories.SquidletFactory.spawn({
                        x: contact.contactee.PositionComponent.x,
                        y: contact.contactee.PositionComponent.y
                    });
                    foodToRemove.push(entity);
                } else {
                    entity.FoodComponent.duration -= 1;
                    if (entity.FoodComponent.duration === 0) {
                        foodToRemove.push(entity);
                    }
                }
                contact = undefined;
            }

            for (i = 0, n = foodToRemove.length; i < n; i += 1) {
                this.engine.factories.FoodFactory.despawn(foodToRemove[i]);
            }
        };

        return FoodSystem;

    }());

}(window));