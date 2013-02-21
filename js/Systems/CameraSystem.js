(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.CameraSystem = (function () {

        /**
         * CameraSystem
         * @return {CameraSystem}
         * @constructor
         */

        function CameraSystem(engine) {
            return CameraSystem.alloc(this, arguments);
        }

        app.inherit(app.System, CameraSystem);

        CameraSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            this.targetEntity = undefined;
            this.camera = undefined;
            this.position = { x: 0, y: 0 };
            return this;
        };

        CameraSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            if (this.camera) {
                this.engine.removeEntity(this.camera);
                this.camera.destroy();
            }
            this.targetEntity = undefined;
        };

        /*** Interface ***/

        CameraSystem.prototype.setTargetEntity = function (entity) {
            this.targetEntity = entity;
            var targetPosition = entity.PositionComponent,
                x = targetPosition.x * -1,
                y = targetPosition.y * -1;

            if (!this.camera) {
                this.camera = new app.Entity({
                    tag: 'camera_',
                    components: {
                        SteeringComponent: {
                            maxSteeringVelocity: 50,
                            maxSteeringForce: 800
                        },
                        PositionComponent: {
                            x: x,
                            y: y
                        },
                        PhysicsComponent: {
                            oceanBound: false,
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
                this.engine.addEntity(this.camera);
            } else {
                this.camera.PositionComponent.x = x;
                this.camera.PositionComponent.y = y;
                this.camera.PhysicsComponent.body.SetPosition({
                    x: b2.toWorld(x),
                    y: b2.toWorld(y)
                });
            }
        };

        /*** Update Event ***/

        CameraSystem.prototype.update = function () {
            var targetPosition, cameraPosition, cameraSteering;

            if (this.targetEntity && this.targetEntity.PositionComponent) {

                targetPosition = this.targetEntity.PositionComponent;
                cameraPosition = this.camera.PositionComponent;

                cameraSteering = this.camera.SteeringComponent;
                cameraSteering.behavior = 'approach';
                cameraSteering.target.x = targetPosition.dx / 6;
                cameraSteering.target.y = targetPosition.dy / 6;

                this.position = {
                    x: targetPosition.x + cameraPosition.x,
                    y: targetPosition.y + cameraPosition.y
                };

                if (this.position.y < 0) {
                    this.position.y = 0;
                }

                this.engine.triggerEvent('cameraSet', this.position);
            }
        };

        return CameraSystem;

    }());

}(window));