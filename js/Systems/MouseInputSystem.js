(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.MouseInputSystem = (function () {

        /**
         * InputSystem
         * Processes human input
         * @param engine
         * @return {MouseInputSystem}
         * @constructor
         */

        function MouseInputSystem(engine) {
            return MouseInputSystem.alloc(this, arguments);
        }

        app.inherit(app.System, MouseInputSystem);

        MouseInputSystem.prototype.init = function () {
            var self = this, container = this.engine.inputContainer;

            this.allowInput = true;
            this.mousedata = {
                leftDown: false,
                active: false,
                position: {
                    x: 0,
                    y: 0
                }
            };

            $(container).mousedown(this.mousedown.bind(this));
            $(container).mouseup(this.mouseup.bind(this));
            $(container).mouseenter(this.mouseenter.bind(this));
            $(container).mouseleave(this.mouseleave.bind(this));
            $(container).mousemove(this.mousemove.bind(this));

            container.oncontextmenu = function () {
                return false;
            };

            this.engine.bindEvent('stageStart', this);
            this.engine.bindEvent('stageEnd', this);
            return this;
        };

        MouseInputSystem.prototype.deinit = function () {
            this.engine.unbindEvent('stageStart', this);
            this.engine.unbindEvent('stageEnd', this);
        };

        MouseInputSystem.prototype.stageStart = function () {
            this.allowInput = true;
        };

        MouseInputSystem.prototype.stageEnd = function () {
            this.allowInput = false;
        };

        MouseInputSystem.prototype.mousedown = function (event) {
            if (this.allowInput) {
                this.mousedata.leftDown = true;
                this.mousedata.active = true;
                this.engine.triggerEvent('mouseUpdate', this.mousedata);
                return false;
            }
            return true;
        };

        MouseInputSystem.prototype.mouseup = function (event) {
            if (this.allowInput) {
                this.mousedata.leftDown = false;
                this.engine.triggerEvent('mouseUpdate', this.mousedata);
                return false;
            }
            return true;
        };

        MouseInputSystem.prototype.mouseenter = function (event) {
            if (this.allowInput) {
                this.mousedata.active = true;
                this.engine.triggerEvent('mouseUpdate', this.mousedata);
                return false;
            }
            return true;
        };

        MouseInputSystem.prototype.mouseleave = function (event) {
            if (this.allowInput) {
                this.mousedata.active = false;
                this.mousedata.leftDown = false;
                this.engine.triggerEvent('mouseUpdate', this.mousedata);
                return false;
            }
            return true;
        };

        MouseInputSystem.prototype.mousemove = function (event) {
            if (this.allowInput) {
                this.mousedata.active = true;
                this.mousedata.position.x = event.offsetX;
                this.mousedata.position.y = event.offsetY;
                this.engine.triggerEvent('mouseUpdate', this.mousedata);
                return false;
            }
            return true;
        };

        return MouseInputSystem;

    }());

}(window));