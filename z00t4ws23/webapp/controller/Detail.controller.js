sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/comp/smartchart/SmartChart",
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

        _getBundle: function () {
            return this.getView().getModel("i18n").getResourceBundle();
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

        createNewGoal: function (oEvent) {

            console.log("createNewGoal");
            var sButtonId = oEvent.getSource().getId();
            console.log(sButtonId);
            let that = this;
            let cancelButton = new sap.m.Button({
                text: "Cancel",
                type: sap.m.ButtonType.Reject,
                press: function () {
                    sap.ui.getCore().byId("GoalPopup").destroy();
                }
            });

            let saveButton = new sap.m.Button({
                text: "Save",
                type: sap.m.ButtonType.Accept,
                press: function () {
                    // Get the view's model
                    let oModel = that.getView().getModel();
                    console.log(oModel);

                    var oStartDatePicker = sap.ui.getCore().byId("goalStartDate");
                    var oEndDatePicker = sap.ui.getCore().byId("goalEndDate");

                    // Get the JavaScript Date objects from the DatePicker
                    var oStartDate = oStartDatePicker.getDateValue();
                    var oEndDate = oEndDatePicker.getDateValue();

                    // Use DateFormat to format the dates
                    var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm" });
                    var sFormattedStartDate = oDateTimeFormat.format(oStartDate);
                    var sFormattedEndDate = oDateTimeFormat.format(oEndDate);

                    let oNewGoal = {
                        Goalnr: sap.ui.getCore().byId("goalId").getValue(),
                        StartDate: sFormattedStartDate,
                        EndDate: sFormattedEndDate,
                        Metric: sap.ui.getCore().byId("goalMetric").getValue(),
                        Description: sap.ui.getCore().byId("goalDescription").getValue(),
                        Value: parseFloat(sap.ui.getCore().byId("goalValue").getValue()),
                        Werks: sap.ui.getCore().byId("goalWerks").getValue()
                    };
                    // Call the OData service to create a new sustainability goal with callback functions for error and success
                    oModel.create("/SustainabilityGoalsSet", oNewGoal, {
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show(
                                "Goal creation successful"
                            );
                            oModel.refresh();
                            sap.ui.getCore().byId("GoalPopup").destroy();
                        },
                        error: function (oError) {
                            sap.m.MessageToast.show(
                                "Goal creation failed"
                            );
                        },
                    });
                    console.log(oNewGoal);
                },
            });

            let oDialog = new sap.m.Dialog("GoalPopup", {
                title: "Create New Sustainability Goal",
                modal: true,
                contentWidth: "1em",
                buttons: [saveButton, cancelButton],
                content: [
                    new sap.m.Label({ text: "Goal ID" }),
                    new sap.m.Input({ maxLength: 40, id: "goalId" }),
                    new sap.m.Label({ text: "Start Date" }),
                    new sap.m.DatePicker({ id: "goalStartDate" }),
                    new sap.m.Label({ text: "End Date" }),
                    new sap.m.DatePicker({ id: "goalEndDate" }),
                    new sap.m.Label({ text: "Metric" }),
                    new sap.m.Input({ maxLength: 40, id: "goalMetric" }),
                    new sap.m.Label({ text: "Description" }),
                    new sap.m.Input({ maxLength: 100, id: "goalDescription" }),
                    new sap.m.Label({ text: "Value" }),
                    new sap.m.Input({ type: "Number", id: "goalValue" }),
                    new sap.m.Label({ text: "Plant" }),
                    new sap.m.Input({ maxLength: 4, id: "goalWerks" }),
                ],
            });
            oDialog.open();
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