(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.SteeringSystem = (function () {

        /**
         * SteeringSystem
         * Updates physics bodies based on steering behavior.
         * @param engine
         * @return {*}
         * @constructor
         */

        function SteeringSystem(engine) {
            return SteeringSystem.alloc(this, arguments);
        }
        app.inherit(app.System, SteeringSystem);

        SteeringSystem.prototype.init = function () {
            this.createModel(['SteeringComponent', 'PhysicsComponent']);
            this.engine.bindEvent('update', this);
            return this;
        };

        SteeringSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.destroyModel();
        };

        SteeringSystem.prototype.update = function () {
            var i, n, steering, physics, position;
            for (i = 0, n = this.model.entities.length; i < n; i += 1) {
                steering = this.model.entities[i].SteeringComponent;
                physics = this.model.entities[i].PhysicsComponent;

                if (physics.oceanBound && physics.outOfWater) {
                    return;
                }

                if (steering.behavior) {
                    this[steering.behavior](steering, physics);
                }
            }
        };

        /*** Steering Functions ***/

        SteeringSystem.prototype.applyForceForVelocity = function (steering, physics, velocity) {
            var force, body = physics.body;

            force = new b2.Vec2();
            force.SetV(velocity);
            force.Multiply(body.GetMass());

            if (force.Length() > steering.maxForce) {
                force.Normalize();
                force.Multiply(steering.maxForce);
            }

            body.ApplyForce(force, body.GetWorldCenter());
        };

        SteeringSystem.prototype.seek = function (steering, physics) {
            var linearVelocity, targetVelocity, steeringVelocity,
                body = physics.body,
                maxVelocity = steering.maxVelocity;

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

            this.applyForceForVelocity(steering, physics, steeringVelocity);
        };

        SteeringSystem.prototype.approach = function (steering, physics) {
            var linearVelocity, targetVelocity, steeringVelocity,
                body = physics.body,
                maxVelocity = steering.maxVelocity;

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

            this.applyForceForVelocity(steering, physics, steeringVelocity);
        };

        return SteeringSystem;

    }());

}(window));