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

            this.contactListener = new b2.ContactListener();
            this.contactListener.BeginContact = this.beginContact.bind(this);
            this.contactListener.EndContact = this.endContact.bind(this);
            this.contactListener.PreSolve = this.preSolve.bind(this);
            this.contactListener.PostSolve = this.postSolve.bind(this);
            this.world.SetContactListener(this.contactListener);

            this.engine.bindEvent('update', this);
            this.engine.bindEvent('entityAdded', this);
            this.engine.bindEvent('entityRemoved', this);

            return this;
        };

        PhysicsSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('entityAdded', this);
            this.engine.unbindEvent('entityRemoved', this);

            this.world = undefined;
            return this;
        };

        PhysicsSystem.prototype.entityAdded = function (entity) {
            var physics = entity.PhysicsComponent,
                position = entity.PositionComponent || { x: 0, y: 0 };

            if (physics !== undefined) {
                physics.bodyDef.position.x = b2.toWorld(position.x);
                physics.bodyDef.position.y = b2.toWorld(position.y);
                physics.body = this.world.CreateBody(physics.bodyDef);
                physics.body.SetUserData(entity);
                physics.fixture = physics.body.CreateFixture(physics.fixtureDef);
            }
        };

        PhysicsSystem.prototype.entityRemoved = function (entity) {
            var physics = entity.PhysicsComponent;

            if (physics !== undefined) {
                physics.body.DestroyFixture(physics.fixture);
                physics.body.SetUserData(null);
                this.world.DestroyBody(physics.body);
            }
        };

        PhysicsSystem.prototype.update = function (dt) {
            var i, n, physics, position, pos, vel, torque, force, mass, center,
                entityArray;
            this.world.Step(dt, b2.VELOCITY_ITERATIONS, b2.POSITION_ITERATIONS);
            this.world.ClearForces();

            entityArray = this.engine.entitiesForComponent('PhysicsComponent');

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                physics = entityArray[i].PhysicsComponent;
                position = entityArray[i].PositionComponent;

                pos = physics.body.GetPosition();
                vel = physics.body.GetLinearVelocity();

                position.x = b2.toPixels(pos.x);
                position.y = b2.toPixels(pos.y);
                position.dx = b2.toPixels(vel.x);
                position.dy = b2.toPixels(vel.y);
                position.angle = physics.body.GetAngle();

                if (physics.oceanBound) {
                    mass = physics.body.GetMass();
                    center = physics.body.GetWorldCenter();

                    if (pos.y < b2.WATERLEVEL) {

                        // Apply Gravity
                        force = new b2.Vec2();
                        force.SetV(this.gravity);
                        force.Multiply(mass);
                        physics.body.ApplyForce(force, center);

                        physics.outOfWater = true;
                    } else {

                        // Apply Drag
                        if (physics.drag) {
                            torque = physics.body.GetAngularVelocity();
                            torque *= physics.drag * mass;
                            physics.body.ApplyTorque(torque);

                            force = new b2.Vec2();
                            force.SetV(vel);
                            force.Multiply(physics.drag);
                            force.Multiply(mass);
                            physics.body.ApplyForce(force, center);
                        }

                        // Apply Current
                        physics.body.ApplyForce(this.current, center);
                        physics.outOfWater = false;
                    }
                }
            }
        };

        PhysicsSystem.prototype.beginContact = function (contact) {
            this.triggerContact('beginContact', contact);
        };

        PhysicsSystem.prototype.endContact = function (contact) {
            this.triggerContact('endContact', contact);
        };

        PhysicsSystem.prototype.preSolve = function (contact, oldManifold) {
            this.triggerContact('preSolve', contact, oldManifold);
        };

        PhysicsSystem.prototype.postSolve = function (contact, impulse) {
            this.triggerContact('postSolve', contact, impulse);
        };

        PhysicsSystem.prototype.triggerContact = function () {
            var args = Array.prototype.slice.call(arguments),
                event = args[0],
                contact = args[1],
                entityA = contact.GetFixtureA().GetBody().GetUserData(),
                entityB = contact.GetFixtureB().GetBody().GetUserData();
            entityA.triggerContactEvent(event, entityA, entityB, contact, args[2]);
            entityB.triggerContactEvent(event, entityB, entityA, contact, args[2]);
        };

        return PhysicsSystem;

    }());

}(window));