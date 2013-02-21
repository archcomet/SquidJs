(function (global) {
    'use strict';

    global.app = global.app || {};

    global.app.Settings = (function () {

        /**
         * Settings
         * A debug-able settings object
         * @return {Settings}
         * @constructor
         */

        function Settings(options) {
            return Settings.alloc(this, arguments);
        }

        app.inherit(app.BaseObj, Settings);

        Settings.prototype.init = function (options) {
            _.defaults(this, options);
            return this;
        };

        Settings.prototype.enableDebugControl = function () {
            this.disableDebugControl();
            var key, gui = new global.dat.GUI();
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    if ($.isPlainObject(this[key])) {
                        this.addFolderToGui(key, gui);
                    } else {
                        this.addToGui(gui, this, key);
                    }
                }
            }
            this.gui = gui;
        };

        Settings.prototype.disableDebugControl = function () {
            if (this.gui !== undefined) {
                this.gui.destroy();
                delete this.gui;
            }
        };

        Settings.prototype.addFolderToGui = function (folder, gui) {
            var key, f = gui.addFolder(folder);
            for (key in this[folder]) {
                if (this[folder].hasOwnProperty(key)) {
                    this.addToGui(f, this[folder], key);
                }
            }
        };

        Settings.prototype.addToGui = function (gui, object, key) {
            if (key.indexOf('color') >= 0) {
                gui.addColor(object, key);
            } else {
                gui.add(object, key);
            }
        };
        return Settings;

    }());

}(window));