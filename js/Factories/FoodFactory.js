(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.FoodFactory = (function () {

        /**
         * FoodFactory
         * @return {*}
         * @constructor
         */

        function FoodFactory() {
            return FoodFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, FoodFactory);


        FoodFactory.prototype.createFood = function (options) {
            var entity, radius;

            _.defaults(options, {
                x: 0,
                y: 0,
                minRadius: 5,
                maxRadius: 20
            });

            radius = app.random(options.minRadius, options.maxRadius);
            entity = new app.Entity({
                tag: 'food_',
                components: {
                    FoodComponent: {
                        radius: radius
                    },
                    ColorComponent: {
                        h: 27,
                        s: 100,
                        v: 90,
                        dark: false
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: -1
                    },
                    PhysicsComponent: {
                        drag: -0.2,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.1
                        },
                        fixtureDef: {
                            density: 1,
                            friction: 0.5,
                            restitution: 0.2,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius
                            })
                        }
                    }
                }
            });

            this.engine.addEntity(entity);
            return entity;
        };

        FoodFactory.prototype.destroyFood = function (entity) {
            this.engine.removeEntity(entity);
            entity.destroy();
            return this;
        };

        return FoodFactory;

    }());

}(window));