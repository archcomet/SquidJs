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
            this.modelList = this.engine.createModelList('physicsBody', {
                physics: 'PhysicsComponent',
                position: 'PositionComponent'
            });

            this.engine.bindEvent('physicsBodyAdded', this, this.physicsBodyAdded);
            this.engine.bindEvent('physicsBodyRemoved', this, this.physicsBodyRemoved);
            this.engine.bindEvent('update', this, this.update);
            return this;
        };

        PhysicsSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            this.engine.unbindEvent('physicsBodyAdded', this);
            this.engine.unbindEvent('physicsBodyRemoved', this);
            this.engine.destroyModelList(this.modelList.name);
            this.world = undefined;
        };

        PhysicsSystem.prototype.physicsBodyAdded = function (model) {
            var physics = model.physics,
                position = model.position;

            physics.bodyDef.position.x = b2.toWorld(position.x);
            physics.bodyDef.position.y = b2.toWorld(position.y);
            physics.body = this.world.CreateBody(physics.bodyDef);
            physics.fixture = physics.body.CreateFixture(physics.fixtureDef);
        };

        PhysicsSystem.prototype.physicsBodyRemoved = function (model) {
            var physics = model.physics;
            physics.body.DestroyFixture(physics.fixture);
            this.world.DestroyBody(physics.body);
        };

        PhysicsSystem.prototype.update = function (dt) {
            var i, n, model, models, position, velocity;
            this.world.Step(b2.INTERVAL, b2.VELOCITY_ITERATIONS, b2.POSITION_ITERATIONS);
            this.world.ClearForces();

            models = this.modelList.models;
            for (i = 0, n = models.length; i < n; i++) {
                model = models[i];
                position = model.physics.body.GetPosition();
                velocity = model.physics.body.GetLinearVelocity();
                model.position.x = b2.toPixels(position.x);
                model.position.y = b2.toPixels(position.y);
                model.position.dx = b2.toPixels(velocity.x);
                model.position.dy = b2.toPixels(velocity.y);
            }
        };

        return PhysicsSystem;

    }());

}(window));