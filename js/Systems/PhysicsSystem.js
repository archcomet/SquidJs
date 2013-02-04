(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.PhysicsSystem = (function () {

        /**
         * PhysicsSystem
         * Wraps Box2DWeb. Manages physics objects and world.
         * @return {*}
         * @constructor
         */

        function PhysicsSystem() {
            return PhysicsSystem.alloc(this, arguments);
        }
        app.inherit(app.System, PhysicsSystem);

        PhysicsSystem.prototype.init = function () {
            this.world = new b2.World(new b2.Vec2(0, 0), true);
            this.gravity = new b2.Vec2(0, 30);
            this.current = new b2.Vec2(0.5, 0.1);
            this.createModel(['PhysicsComponent', 'PositionComponent'], this.entityAdded, this.entityRemoved);
            this.engine.bindEvent('update', this);
            return this;
        };

        PhysicsSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.destroyModel();
            this.world = undefined;
        };

        PhysicsSystem.prototype.entityAdded = function (entity) {
            var physics = entity.PhysicsComponent,
                position = entity.PositionComponent;

            physics.bodyDef.position.x = b2.toWorld(position.x);
            physics.bodyDef.position.y = b2.toWorld(position.y);
            physics.body = this.world.CreateBody(physics.bodyDef);
            physics.fixture = physics.body.CreateFixture(physics.fixtureDef);
        };

        PhysicsSystem.prototype.entityRemoved = function (entity) {
            var physics = entity.PhysicsComponent;
            physics.body.DestroyFixture(physics.fixture);
            this.world.DestroyBody(physics.body);
        };

        PhysicsSystem.prototype.update = function () {
            var i, n, physics, position, pos, vel, gravityForce, mass;
            this.world.Step(b2.INTERVAL, b2.VELOCITY_ITERATIONS, b2.POSITION_ITERATIONS);
            this.world.ClearForces();

            for (i = 0, n = this.model.entities.length; i < n; i++) {
                physics = this.model.entities[i].PhysicsComponent;
                position = this.model.entities[i].PositionComponent;

                pos = physics.body.GetPosition();
                vel = physics.body.GetLinearVelocity();

                position.x = b2.toPixels(pos.x);
                position.y = b2.toPixels(pos.y);
                position.dx = b2.toPixels(vel.x);
                position.dy = b2.toPixels(vel.y);
                position.angle = physics.body.GetAngle();

                if (physics.oceanBound) {
                    if (pos.y < b2.WATERLEVEL) {
                        mass = physics.body.GetMass();
                        gravityForce = new b2.Vec2();
                        gravityForce.SetV(this.gravity);
                        gravityForce.Multiply(mass);

                        physics.body.ApplyForce(gravityForce, physics.body.GetWorldCenter());
                        physics.outOfWater = true;
                    } else {
                        physics.body.ApplyForce(this.current, physics.body.GetWorldCenter());
                        physics.outOfWater = false;
                    }
                }
            }
        };

        return PhysicsSystem;

    }());

}(window));