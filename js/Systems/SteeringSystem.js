(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.SteeringSystem = (function () {

        /**
         * SteeringSystem
         * Updates physics bodies based on steering behavior.
         * @param engine
         * @return {SteeringSystem}
         * @constructor
         */

        function SteeringSystem(engine) {
            return SteeringSystem.alloc(this, arguments);
        }
        app.inherit(app.System, SteeringSystem);

        SteeringSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            return this;
        };

        SteeringSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
        };

        /*** Update Event ***/

        SteeringSystem.prototype.update = function () {
            var i, n, steering, physics,
                entityArray = this.engine.entitiesForComponent('SteeringComponent');
            for (i = 0, n = entityArray.length; i < n; i += 1) {
                steering = entityArray[i].SteeringComponent;
                physics = entityArray[i].PhysicsComponent;

                if (physics.oceanBound && physics.outOfWater) {
                    return;
                }

                if (steering.behavior) {
                    this[steering.behavior](steering, physics);
                    this.rotateToTarget(steering, physics);
                    this.applyForwardThrust(steering, physics);
                }
            }
        };

        /*** Thrust Functions ***/

        SteeringSystem.prototype.applyForwardThrust = function (steering, physics) {
            var angle, vectorAngle, forwardNormal, linearVelocity, velocity,
                forwardVelocity, thrustVelocity, thrustVector, force;

            if (steering.maxForwardVelocity > 0) {
                angle = physics.body.GetAngle();
                linearVelocity = physics.body.GetLinearVelocity();
                velocity = linearVelocity.Length();
                forwardNormal = {
                    x: Math.cos(angle),
                    y: Math.sin(angle)
                };

                vectorAngle = (linearVelocity.x === 0 && linearVelocity.y === 0) ? 0 :
                        app.vectorAngle(forwardNormal, linearVelocity);
                forwardVelocity = (vectorAngle < Math.PI) ?
                        Math.cos(vectorAngle) * velocity :
                        Math.cos(Math.PI - vectorAngle) * -velocity;

                thrustVelocity = steering.maxForwardVelocity - forwardVelocity;
                force = thrustVelocity * physics.body.GetMass();
                if (force > steering.maxForwardThrust) {
                    force = steering.maxForwardThrust;
                }

                thrustVector = {
                    x: forwardNormal.x * force,
                    y: forwardNormal.y * force
                };

                physics.body.ApplyForce(thrustVector, physics.body.GetWorldCenter());
            }
        };

        /*** Rotation Functions ***/

        SteeringSystem.prototype.applyTorqueForAngularVelocity = function (steering, physics, angularVelocity) {
            var torque = physics.body.GetInertia() * (angularVelocity / (1 / 60));
            if (Math.abs(torque) > steering.maxTorque) {
                torque = (torque > 0) ? steering.maxTorque : -steering.maxTorque;
            }
            physics.body.ApplyTorque(torque);
        };

        SteeringSystem.prototype.rotateToTarget = function (steering, physics) {
            var targetVector, targetAngle, currentAngle, angularDisplacement,
                targetAngularVelocity, steeringAngularVelocity;

            if (steering.maxAngularVelocity > 0 && steering.target !== undefined) {
                targetVector = new b2.Vec2();
                targetVector.SetV(b2.toWorld(steering.target));
                targetVector.Subtract(physics.body.GetPosition());

                targetAngle = Math.atan2(targetVector.y, targetVector.x);
                currentAngle = physics.body.GetAngle();
                angularDisplacement = targetAngle - currentAngle;
                while (angularDisplacement < -Math.PI) { angularDisplacement += Math.PI * 2; }
                while (angularDisplacement >  Math.PI) { angularDisplacement -= Math.PI * 2; }

                targetAngularVelocity = angularDisplacement / (1 / 60);
                if (Math.abs(targetAngularVelocity) > steering.maxAngularVelocity) {
                    targetAngularVelocity = (targetAngularVelocity > 0) ?
                            steering.maxAngularVelocity : -steering.maxAngularVelocity;
                }

                steeringAngularVelocity = targetAngularVelocity - physics.body.GetAngularVelocity();
                this.applyTorqueForAngularVelocity(steering, physics, steeringAngularVelocity);
            }
        };

        /*** Steering Functions ***/

        SteeringSystem.prototype.applyForceForSteeringVelocity = function (steering, physics, velocity) {
            var body = physics.body, force = new b2.Vec2();
            force.SetV(velocity);
            force.Multiply(body.GetMass());

            if (force.Length() > steering.maxSteeringForce) {
                force.Normalize();
                force.Multiply(steering.maxSteeringForce);
            }

            body.ApplyForce(force, body.GetWorldCenter());
        };

        SteeringSystem.prototype.seek = function (steering, physics) {
            var linearVelocity, targetVelocity, steeringVelocity,
                body = physics.body,
                maxVelocity = steering.maxSteeringVelocity;

            linearVelocity = body.GetLinearVelocity();
            targetVelocity = new b2.Vec2();
            targetVelocity.SetV(b2.toWorld(steering.target));
            targetVelocity.Subtract(body.GetPosition());

            if (steering.sprinting) {
                maxVelocity *= steering.sprintMultiplier;
            }

            targetVelocity.Normalize();
            targetVelocity.Multiply(maxVelocity);

            steeringVelocity = new b2.Vec2();
            steeringVelocity.SetV(targetVelocity);
            steeringVelocity.Subtract(linearVelocity);

            this.applyForceForSteeringVelocity(steering, physics, steeringVelocity);
        };

        SteeringSystem.prototype.approach = function (steering, physics) {
            var linearVelocity, targetVelocity, steeringVelocity,
                body = physics.body,
                maxVelocity = steering.maxSteeringVelocity;

            linearVelocity = body.GetLinearVelocity();
            targetVelocity = new b2.Vec2();
            targetVelocity.SetV(b2.toWorld(steering.target));
            targetVelocity.Subtract(body.GetPosition());

            if (targetVelocity.Length() > maxVelocity) {
                targetVelocity.Normalize();
                targetVelocity.Multiply(maxVelocity);
            }

            steeringVelocity = new b2.Vec2();
            steeringVelocity.SetV(targetVelocity);
            steeringVelocity.Subtract(linearVelocity);

            this.applyForceForSteeringVelocity(steering, physics, steeringVelocity);
        };

        SteeringSystem.prototype.flee = function (steering, physics) {
            var linearVelocity, targetVelocity, steeringVelocity,
                body = physics.body,
                maxVelocity = steering.maxSteeringVelocity;

            linearVelocity = body.GetLinearVelocity();
            targetVelocity = new b2.Vec2();
            targetVelocity.SetV(b2.toWorld(body.GetPosition()));
            targetVelocity.Subtract(b2.toWorld(steering.target));

            if (steering.sprinting) {
                maxVelocity *= steering.sprintMultiplier;
            }

            targetVelocity.Normalize();
            targetVelocity.Multiply(maxVelocity);

            steeringVelocity = new b2.Vec2();
            steeringVelocity.SetV(targetVelocity);
            steeringVelocity.Subtract(linearVelocity);

            this.applyForceForSteeringVelocity(steering, physics, steeringVelocity);
        };

        return SteeringSystem;

    }());

}(window));