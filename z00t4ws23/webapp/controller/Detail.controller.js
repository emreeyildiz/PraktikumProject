sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/comp/smartchart/SmartChart",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",

], function (Controller, UIComponent, History, SmartChart, DateFormat) {
    'use strict'

    return Controller.extend("z00t4ws23.controller.Detail", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
            
        },

        _onObjectMatched: function (oEvent) {
            console.log(oEvent);
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").plantPath),
                model: "plant"
            });
        },

        _onRouteMatched: function (oEvent) {
            let sPlantPath = oEvent.getParameter("arguments").plantPath
            console.log(this.getOwnerComponent().getModel().oData)
            let data = this.getOwnerComponent().getModel().oData;
            // let Iindex = data.
            this.getView().bindElement("/PlantsSet" + "('" + sPlantPath + "')");
            // this.getView().bindElement("/PlantsSet" + "('" + sPlantPath + "')");

            var oModel = this.getView().getModel(); // Get the OData model
            var oJsonModel = new sap.ui.model.json.JSONModel();
            var oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sPlantPath);
            oModel.read("/OrdersSet", {
                filters: [oFilter],
                success: function (oData, response) {
                    // Success handling
                    console.log("Orders fetched:", oData);
                    oJsonModel.setData(oData);
                },
                error: function (oError) {
                    // Error handling
                    console.error("Error fetching orders:", oError);
                }
            });
            this.getView().setModel(oJsonModel, "orders");
        },
        onOpenDialog: function () {
            this.getOwnerComponent().openCreateOrder();
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            }
            else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", {}, true);
            }
        },

        createOrder: function () {
            var oModel = this.getView().getModel();
            var dateFormat = DateFormat.getDateInstance({ pattern: "YYYYMMDD" });
            var startDate = this.getView().byId("startDatePicker").getDateValue();
            var endDate = this.getView().byId("endDatePicker").getDateValue();
            var oData = {
                OrderId: this.getView().byId("orderIdInput").getValue(),
                Werks: this.getView().byId("werksInput").getValue(),
                StartDate: startDate ? dateFormat.format(startDate) : "",
                EndDate: endDate ? dateFormat.format(endDate) : "",
                EnrgCons: parseFloat(this.getView().byId("enrgConsInput").getValue()),
                RnwEnrgCons: parseFloat(this.getView().byId("rnwEnrgConsInput").getValue()),
                WaterCons: parseFloat(this.getView().byId("waterConsInput").getValue()),
                CarbonFp: parseFloat(this.getView().byId("carbonFpInput").getValue())
            };
            console.log("Order Data ----- ", orderData);
            oModel.create("/OrderSet", oData, {
                success: function () {
                    MessageToast.show("Order created successfully");
                },
                error: function (oError) {
                    MessageToast.show("Error creating order");
                }
            });
        }

    });
});