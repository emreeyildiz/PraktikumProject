sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/comp/smartchart/SmartChart",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
], function (Controller, UIComponent, History, SmartChart, DateFormat, NumberFormat) {
    'use strict'

    return Controller.extend("z00t4ws23.controller.Detail", {
        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
            var oViewModel = new sap.ui.model.json.JSONModel({
                currentPlant: ""
            });
            this.getView().setModel(oViewModel, "viewModel");
        },
        _onObjectMatched: function (oEvent) {
            console.log(oEvent);
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").plantPath),
                model: "plant"
            });
        },
        onBeforeRebindTable: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var sPlantPath = oViewModel.getProperty("/currentPlant");

            if (sPlantPath) {
                var oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sPlantPath);
                var oBindingParams = oEvent.getParameter("bindingParams");
                oBindingParams.filters.push(oFilter);
            }
        },
        _onRouteMatched: function (oEvent) {
            let sPlantPath = oEvent.getParameter("arguments").plantPath
            console.log(this.getOwnerComponent().getModel().oData)
            let data = this.getOwnerComponent().getModel().oData;
            var oViewModel = this.getView().getModel("viewModel");

            if (oViewModel) {
                oViewModel.setProperty("/currentPlant", sPlantPath);
            } else {
                console.error("ViewModel not found");
            }
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

            oModel.read("/SustainabilityGoalsSet", {
                filters: [oFilter],
                success: function (oData, response) {
                    // Success handling
                    console.log("Goals fetched:", oData);
                    oJsonModel.setData(oData);
                },
                error: function (oError) {
                    // Error handling
                    console.error("Error fetching goals:", oError);
                }
            });
            this.getView().setModel(oJsonModel, "goals");
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

    });
});