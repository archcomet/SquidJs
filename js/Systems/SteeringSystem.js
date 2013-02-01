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
            this.modelList = this.engine.createModelList('SteeringModel', {
                steering: 'SteeringComponent',
                physics: 'PhysicsComponent'
            });
            this.engine.bindEvent('update', this);
            return this;
        };

        SteeringSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.destroyModelList(this.modelList.name);
        };

        SteeringSystem.prototype.update = function (dt) {
            var i, n, model, models;
            models = this.modelList.models;
            for (i = 0, n = models.length; i < n; i++) {
                model = models[i];
                if (model.steering.behavior) {
                    this[model.steering.behavior](model);
                }
            }
        };

        /*** Steering Functions ***/

        SteeringSystem.prototype.applyForceForVelocity = function (model, velocity) {
            var force,
                steering = model.steering,
                body = model.physics.body;

            force = new b2.Vec2();
            force.SetV(velocity);
            force.Multiply(body.GetMass());

            if (force.Length() > steering.maxForce) {
                force.Normalize();
                force.Multiply(steering.maxForce);
            }

            body.ApplyForce(force, body.GetWorldCenter());
        };

        SteeringSystem.prototype.seek = function (model) {
            var linearVelocity, targetVelocity, steeringVelocity,
                steering = model.steering,
                body = model.physics.body,
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

            this.applyForceForVelocity(model, steeringVelocity);
        };

        SteeringSystem.prototype.approach = function (model) {
            var linearVelocity, targetVelocity, steeringVelocity,
                steering = model.steering,
                body = model.physics.body,
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

            this.applyForceForVelocity(model, steeringVelocity);
        };

        return SteeringSystem;

    }());

}(window));