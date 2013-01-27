(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CameraSystem = (function () {

        /**
         * CameraSystem
         * @return {*}
         * @constructor
         */

        function CameraSystem(engine) {
            return CameraSystem.alloc(this, arguments);
        }
        app.inherit(app.System, CameraSystem);

        CameraSystem.prototype.init = function () {
            this.engine.bindEvent('update', this, this.update);
            this.targetEntity = undefined;
            this.camera = undefined;
            return this;
        };

        CameraSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.destroyEntity(this.camera);
            this.targetEntity = undefined;
        };

        CameraSystem.prototype.setTargetEntity = function (entity) {
            this.targetEntity = entity;
            var targetPosition = entity.components.PositionComponent,
                x = targetPosition.x * -1,
                y = targetPosition.y * -1;

            if (!this.camera) {
                this.camera = this.engine.createEntity({
                    tag: 'camera_',
                    components: {
                        SteeringComponent: {
                            maxVelocity: 50,
                            maxForce: 800
                        },
                        PositionComponent: {
                            x: 0,
                            y: 0
                        },
                        PhysicsComponent: {
                            bodyDef: {
                                type: b2.Body.b2_dynamicBody
                            },
                            fixtureDef: {
                                density: 1.0,
                                filter: b2.makeFilterData(0x0000, 0x0000, 0),
                                shape: b2.makeShape({
                                    type: 'circle',
                                    radius: 1
                                })
                            }
                        }
                    }
                });
            }

            this.camera.components.PositionComponent.x = x;
            this.camera.components.PositionComponent.y = y;
            this.camera.components.PhysicsComponent.body.SetPosition({
                x: b2.toWorld(x),
                y: b2.toWorld(y)
            });
        };

        CameraSystem.prototype.update = function () {
            var position, targetPosition, cameraPosition, cameraSteering;

            if (this.targetEntity) {

                targetPosition = this.targetEntity.components.PositionComponent;
                cameraPosition = this.camera.components.PositionComponent;

                cameraSteering = this.camera.components.SteeringComponent;
                cameraSteering.behavior = 'approach';
                cameraSteering.target.x = targetPosition.dx / 6;
                cameraSteering.target.y = targetPosition.dy / 6;

                position = {
                    x: targetPosition.x + cameraPosition.x,
                    y: targetPosition.y + cameraPosition.y
                };

                if (position.y < 0) {
                    position.y = 0;
                }

                this.engine.triggerEvent('cameraSet', position);
            }
        };

        return CameraSystem;

    }());

}(window));