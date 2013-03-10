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
            this.engine.bindEvent('restart', this);
            this.engine.bindEvent('rockSnakeKilled', this);
            this.foodCollected = 0;
            this.settings = {
                foodPerSquidlet: 3,
                minFoodDropPerKill: 2,
                maxFoodDropPerKill: 5,
                dropImpulse: 5
            };
            return this;
        };

        FoodSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('restart', this);
            this.engine.unbindEvent('rockSnakeKilled', this);
        };

        /*** System Update ***/

        FoodSystem.prototype.rockSnakeKilled = function (rockSnake) {
            var food, body,
                i, n = app.random(this.settings.minFoodDropPerKill, this.settings.maxFoodDropPerKill),
                theta = 0,
                step = (Math.PI * 2) / n;

            for (i = 0; i < n; i += 1) {
                food = this.engine.factories.FoodFactory.spawn({
                    x: rockSnake.PositionComponent.x,
                    y: rockSnake.PositionComponent.y
                });

                body = food.PhysicsComponent.body;
                body.ApplyImpulse({
                    x: Math.cos(theta) * this.settings.dropImpulse,
                    y: Math.sin(theta) * this.settings.dropImpulse
                }, body.GetWorldCenter());

                theta += step;
            }
        };

        FoodSystem.prototype.restart = function () {
            this.foodCollected = 0;
        };

        FoodSystem.prototype.update = function (dt) {
            var i, n, j, m, entity, contact,
                entities = this.engine.entitiesForComponent('FoodComponent'),
                foodToRemove = [];

            for (i = 0, n = entities.length; i < n; i += 1) {
                entity = entities[i];
                for (j = 0, m = entity.PhysicsComponent.contacts.length; j < m; j += 1) {
                    contact = entity.PhysicsComponent.contacts[j];
                    if (contact.event === 'beginContact' && contact.contactee.SquidPlayerComponent !== undefined) {
                        break;
                    } else {
                        contact = undefined;
                    }
                }

                if (contact !== undefined) {
                    foodToRemove.push(entity);
                    this.foodCollected += 1;
                    this.engine.triggerEvent('foodCollected', contact.contactee);
                    if ((this.foodCollected % this.settings.foodPerSquidlet) === 0) {
                        this.engine.factories.SquidletFactory.spawn({
                            x: contact.contactee.PositionComponent.x,
                            y: contact.contactee.PositionComponent.y
                        });
                    }
                } else {
                    entity.FoodComponent.duration -= 1;
                    if (entity.FoodComponent.duration <= 0) {
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