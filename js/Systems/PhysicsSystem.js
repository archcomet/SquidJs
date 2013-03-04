(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.PhysicsSystem = (function () {

        /**
         * PhysicsSystem
         * Wraps Box2DWeb. Manages physics objects and world.
         * @return {PhysicsSystem}
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

        /*** Update Event ***/

        PhysicsSystem.prototype.update = function (dt) {
            var i, n, physics, position, pos, vel, torque, force, mass, center,
                entityArray;

            entityArray = this.engine.entitiesForComponent('PhysicsComponent');

            for (i = 0, n = entityArray.length; i < n; i += 1) {
                entityArray[i].PhysicsComponent.contacts.length = 0;
            }

            this.world.Step(dt, b2.VELOCITY_ITERATIONS, b2.POSITION_ITERATIONS);
            this.world.ClearForces();


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

        /*** Entity Events ***/

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

        /*** Contact Listener ***/

        PhysicsSystem.prototype.beginContact = function (contact) {
            var entityA = contact.GetFixtureA().GetBody().GetUserData(),
                entityB = contact.GetFixtureB().GetBody().GetUserData();

            entityA.PhysicsComponent.contacts.push({
                event: 'beginContact',
                contactee: entityB,
                contact: contact
            });

            entityB.PhysicsComponent.contacts.push({
                event: 'beginContact',
                contactee: entityA,
                contact: contact
            });
        };

        PhysicsSystem.prototype.endContact = function (contact) {
            var entityA = contact.GetFixtureA().GetBody().GetUserData(),
                entityB = contact.GetFixtureB().GetBody().GetUserData();

            entityA.PhysicsComponent.contacts.push({
                event: 'endContact',
                contactee: entityB,
                contact: contact
            });

            entityB.PhysicsComponent.contacts.push({
                event: 'endContact',
                contactee: entityA,
                contact: contact
            });
        };

        PhysicsSystem.prototype.preSolve = function (contact, oldManifold) {
            if (contact.IsTouching()) {
                var kineticEnergyA, kineticEnergyB,
                    linearVelocityAB, linearVelocityBA,
                    bodyA = contact.GetFixtureA().GetBody(),
                    bodyB = contact.GetFixtureB().GetBody(),
                    entityA = bodyA.GetUserData(),
                    entityB = bodyB.GetUserData(),
                    massA = bodyA.GetMass(),
                    massB = bodyB.GetMass(),
                    velocityA = bodyA.GetLinearVelocity(),
                    velocityB = bodyB.GetLinearVelocity(),
                    vecAB = new b2.Vec2(),
                    vecBA = new b2.Vec2();

                vecAB.SetV(velocityA);
                vecAB.Subtract(velocityB);
                linearVelocityAB = vecAB.Length();
                kineticEnergyB = 0.5 * massB * linearVelocityAB * linearVelocityAB;

                vecBA.SetV(velocityB);
                vecBA.Subtract(velocityA);
                linearVelocityBA = vecBA.Length();
                kineticEnergyA = 0.5 * massA * linearVelocityBA * linearVelocityBA;

                entityA.PhysicsComponent.contacts.push({
                    event: 'preSolve',
                    contactee: entityB,
                    contact: contact,
                    oldManifold: oldManifold,
                    entityKE: kineticEnergyA,
                    contacteeKE: kineticEnergyB
                });

                entityB.PhysicsComponent.contacts.push({
                    event: 'preSolve',
                    contactee: entityA,
                    contact: contact,
                    oldManifold: oldManifold,
                    entityKE: kineticEnergyB,
                    contacteeKE: kineticEnergyA
                });
            }
        };

        PhysicsSystem.prototype.postSolve = function (contact, impulse) {
            var entityA = contact.GetFixtureA().GetBody().GetUserData(),
                entityB = contact.GetFixtureB().GetBody().GetUserData();

            entityA.PhysicsComponent.contacts.push({
                event: 'postSolve',
                contactee: entityB,
                contact: contact,
                impulse: impulse
            });

            entityB.PhysicsComponent.contacts.push({
                event: 'postSolve',
                contactee: entityA,
                contact: contact,
                impulse: impulse
            });
        };

        return PhysicsSystem;

    }());

}(window));