/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "z00t4ws23/model/models",
    "./controller/CreateOrder"
],
    function (UIComponent, Device, models, CreateOrder) {
        "use strict";

        return UIComponent.extend("z00t4ws23.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();
                this._CreateOrder = new CreateOrder(this.getRootControl());

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            exit: function () {
                this._CreateOrder.destroy();
                delete this._CreateOrder;
            },

            openCreateOrder: function () {
                this._CreateOrder.open();
            }
        });
    }
);