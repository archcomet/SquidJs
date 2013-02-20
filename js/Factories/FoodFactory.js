(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Factory.FoodFactory = (function () {

        /**
         * FoodFactory
         * @return {*}
         * @constructor
         */

        function FoodFactory(engine) {
            return FoodFactory.alloc(this, arguments);
        }

        app.inherit(app.Factory, FoodFactory);

        FoodFactory.prototype.spawn = function (options) {
            var entity, radius;

            _.defaults(options, {
                x: 0,
                y: 0,
                minRadius: 5, //todo
                maxRadius: 15 //todo
            });

            radius = app.random(options.minRadius, options.maxRadius);
            entity = this.createEntity({
                tag: 'food_',
                components: {
                    FoodComponent: {
                        radius: radius
                    },
                    ColorComponent: {
                        h: 27, //todo
                        s: 100, //todo
                        v: 90, //todo
                        dark: false
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: -1 //todo
                    },
                    PhysicsComponent: {
                        drag: -0.8, //todo
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: 0.1 //todo
                        },
                        fixtureDef: {
                            density: 2, //todo
                            friction: 0.5, //todo
                            restitution: 0.2, //todo
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius
                            })
                        }
                    }
                },
                nodes: {
                    FoodNode: {
                        zOrder: 0
                    }
                }
            });

            this.engine.addEntity(entity);
            return entity;
        };

        return FoodFactory;

    }());

}(window));