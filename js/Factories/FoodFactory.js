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

        FoodFactory.prototype.init = function () {
            FoodFactory.parent.init.call(this);
            _.defaults(this.settings, {
                minRadius: 5,
                maxRadius: 15,
                color: { h: 180, s: 0.6, v: 0.06 },
                drag: -0.8,
                linearDampening: 0.1,
                density: 2,
                friction: 0.5,
                restitution: 0.2
            });
        };

        FoodFactory.prototype.spawn = function (options) {
            var entity, radius;

            _.defaults(options, {
                x: 0,
                y: 0,
                minRadius: this.settings.minRadius,
                maxRadius: this.settings.maxRadius
            });

            radius = app.random(options.minRadius, options.maxRadius);
            entity = this.createEntity({
                tag: 'food_',
                components: {
                    FoodComponent: {
                        radius: radius
                    },
                    ColorComponent: {
                        h: this.settings.color.h,
                        s: this.settings.color.s,
                        v: this.settings.color.v,
                        dark: false
                    },
                    PositionComponent: {
                        x: options.x,
                        y: options.y,
                        zOrder: -1
                    },
                    PhysicsComponent: {
                        drag: this.settings.drag,
                        bodyDef: {
                            type: b2.Body.b2_dynamicBody,
                            linearDampening: this.settings.linearDampening
                        },
                        fixtureDef: {
                            density: this.settings.density,
                            friction: this.settings.friction,
                            restitution: this.settings.restitution,
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