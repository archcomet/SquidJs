(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.HealthSystem = (function () {

        /**
         * HealthSystem
         * @return {*}
         * @constructor
         */

        function HealthSystem(engine) {
            return HealthSystem.alloc(this, arguments);
        }

        app.inherit(app.System, HealthSystem);

        HealthSystem.prototype.init = function () {
            this.engine.bindEvent('update', this);
            return this;
        };

        HealthSystem.prototype.deinit = function () {
            this.engine.unbindEvent('update', this);
            return this;
        };

        HealthSystem.prototype.update = function (dt) {
            var i, n, j, m, contactData, entity, entities = this.engine.entitiesForComponent('HealthComponent');

            for (i = 0, n = entities.length; i < n; i += 1) {
                entity = entities[i];

                entity.HealthComponent.lastDamage = 0;
                entity.HealthComponent.lastDamageVector = undefined;

                if (entity.HealthComponent.invulFrames > 0) {
                    entity.HealthComponent.invulFrames -= 1;
                }

                if (entity.HealthComponent.stunFrames > 0) {
                    entity.HealthComponent.stunFrames -= 1;
                }

                if (entity.PhysicsComponent !== undefined &&
                        entity.HealthComponent.invulFrames === 0 &&
                        entity.HealthComponent.health > 0) {
                    for (j = 0, m = entity.PhysicsComponent.contacts.length; j < m; j += 1) {
                        contactData = entity.PhysicsComponent.contacts[j];
                        this.handleContact(entity, contactData);
                    }
                }

                entity.HealthComponent.health -= entity.HealthComponent.lastDamage;
            }
        };

        HealthSystem.prototype.handleContact = function (entity, contactData) {
            var damageMask = entity.HealthComponent.damageMask,
                categoryBits = contactData.contactee.PhysicsComponent.fixtureDef.filter.categoryBits;

            /*jslint bitwise:true */
            if ((damageMask & categoryBits) === categoryBits) {
                /*jslint bitwise:false */

                if (entity.HealthComponent.hardness < contactData.contacteeKE) {
                    entity.HealthComponent.lastDamage += contactData.contacteeKE;

                    entity.HealthComponent.lastDamageVector = new b2.Vec2();
                    entity.HealthComponent.lastDamageVector.SetV({
                        x: entity.PositionComponent.x - contactData.contactee.PositionComponent.x,
                        y: entity.PositionComponent.y - contactData.contactee.PositionComponent.y
                    });

                    entity.HealthComponent.lastDamageVector.Normalize();
                    entity.HealthComponent.lastDamageDealer = contactData.contactee;
                }
            }
        };

        return HealthSystem;

    }());

}(window));