(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.System.MouseInputSystem = (function () {

        /**
         * InputSystem
         * Processes human input
         * @param engine
         * @return {*}
         * @constructor
         */

        function MouseInputSystem(engine) {
            return MouseInputSystem.alloc(this, arguments);
        }
        app.inherit(app.System, MouseInputSystem);

        MouseInputSystem.prototype.init = function () {
            var self = this, container = this.engine.container;

            this.mousedata = {
                leftDown: false,
                active: false,
                position: {
                    x: 0,
                    y: 0
                }
            };

            $(container).mousedown(function () {
                self.mousedata.leftDown = true;
                self.mousedata.active = true;
                self.engine.triggerEvent('mouseUpdate', self.mousedata);
            });

            $(container).mouseup(function () {
                self.mousedata.leftDown = false;
                self.engine.triggerEvent('mouseUpdate', self.mousedata);
            });

            $(container).mouseenter(function () {
                self.mousedata.active = true;
                self.engine.triggerEvent('mouseUpdate', self.mousedata);
            });

            $(container).mouseleave(function () {
                self.mousedata.active = false;
                self.mousedata.leftDown = false;
                self.engine.triggerEvent('mouseUpdate', self.mousedata);
            });

            $(container).mousemove(function (event) {
                self.mousedata.active = true;
                self.mousedata.position.x = event.offsetX;
                self.mousedata.position.y = event.offsetY;
                self.engine.triggerEvent('mouseUpdate', self.mousedata);
            });

            container.oncontextmenu = function () {
                return false;
            };

            return this;
        };

        MouseInputSystem.prototype.deinit = function () {
            $(this.engine.container).mousedown(undefined);
            $(this.engine.container).mouseup(undefined);
            $(this.engine.container).mouseenter(undefined);
            $(this.engine.container).mouseleave(undefined);
            $(this.engine.container).mousemove(undefined);
        };

        return MouseInputSystem;

    }());

}(window));