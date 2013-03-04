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
            this.spawnEvent = 'foodSpawned';
            this.despawnEvent = 'foodDespawned';
            _.defaults(this.settings, {
                minRadius: 5,
                maxRadius: 15,
                minDuration: 500,
                maxDuration: 700,
                color: { h: 45, s: 1, v: 0.9 },
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
                        radius: radius,
                        duration: app.random(this.settings.minDuration, this.settings.maxDuration)
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
                            isSensor: true,
                            density: this.settings.density,
                            friction: this.settings.friction,
                            restitution: this.settings.restitution,
                            shape: b2.makeShape({
                                type: 'circle',
                                radius: radius
                            }),
                            filter: b2.makeFilterData(
                                app.entityCategory.ITEM,
                                app.entityMask.ITEM,
                                0
                            )
                        }
                    }
                },
                nodes: {
                    FoodNode: {
                        zOrder: 0
                    }
                }
            });

            this.spawnEntity(entity);
            return entity;
        };

        return FoodFactory;

    }());

}(window));