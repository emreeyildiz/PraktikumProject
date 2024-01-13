sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
], function (ManagedObject, Fragment, DateFormat) {
    "use strict"

    return ManagedObject.extend("z00t4ws23.controller.CreateOrder", {

        constructor: function (oView) {
            this._oView = oView
        },

        exit: function () {
            delete this._oView;
        },



        open: function () {
            var oView = this._oView;

            // create the dialog lazily
            if (!oView.byId("CreateOrder")) {
                var oFragmentController = {
                    //Call onCloseDialog when dialog is closed
                    onCloseDialog: function () {
                        console.log("onCloseDialog");
                        oView.byId("CreateOrder").close();
                    },
                    onSubmit: function (oControlEvent) {
                        console.log("onSubmit");
                        var oModel = oView.getModel();
                        oView.byId("CreateOrder").close();
                        var dateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd'T'HH:mm" });

                        var orderId = oView.byId("orderIdInput").getValue();
                        var werks = oView.byId("werksInput").getValue();
                        var startDate = oView.byId("startDatePicker").getDateValue();
                        var endDate = oView.byId("endDatePicker").getDateValue();
                        var enrgCons = oView.byId("enrgConsInput").getValue();
                        var rnwEnrgCons = oView.byId("rnwEnrgConsInput").getValue();
                        var waterCons = oView.byId("waterConsInput").getValue();
                        var carbonFp = oView.byId("carbonFpInput").getValue();

                        // Construct your order data object
                        var orderData = {
                            Ordernr: orderId,
                            Werks: werks,
                            StartDate: startDate ? dateFormat.format(startDate) : "",
                            EndDate: endDate ? dateFormat.format(endDate) : "",
                            EnergyConsm: parseFloat(enrgCons),
                            RnwEnergyConsm: parseFloat(rnwEnrgCons),
                            WaterConsm: parseFloat(waterCons),
                            CarbonEmssn: parseFloat(carbonFp)
                        };
                        console.log("Order Data ----- ", orderData);

                        oModel.create("/OrdersSet", orderData, {
                            success: function () {
                                // MessageToast.show("Order created successfully");
                                console.log("Success")
                            },
                            error: function (oError) {
                                // MessageToast.show("Error creating order");
                                console.log("Fail")
                            }
                        });




                    },
                };

                // load asynchronous XML fragment
                Fragment.load({
                    id: oView.getId(),
                    name: "z00t4ws23.view.CreateOrder",
                    controller: oFragmentController
                }).then(function (oDialog) {
                    // connect dialog to the root view of the component (models, lifecycle)
                    oView.addDependent(oDialog);
                    // forward compact/cozy style into dialog
                    oDialog.open();
                });
            } else {
                oView.byId("CreateOrder").open();
            }
        }
    });
});