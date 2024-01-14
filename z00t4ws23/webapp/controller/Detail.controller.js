sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/comp/smartchart/SmartChart",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/ValueState",
], function (Controller, UIComponent, History, ValueState, DateFormat, NumberFormat) {
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
                    var oViewModel = that.getView().getModel("viewModel");
                    var sPlantPath = oViewModel.getProperty("/currentPlant");

                    var oStartDatePicker = sap.ui.getCore().byId("goalStartDate");
                    var oEndDatePicker = sap.ui.getCore().byId("goalEndDate");

                    // Get the JavaScript Date objects from the DatePicker
                    var oStartDate = oStartDatePicker.getDateValue();
                    var oEndDate = oEndDatePicker.getDateValue();

                    // Use DateFormat to format the dates
                    var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm" });
                    var sFormattedStartDate = oDateTimeFormat.format(oStartDate);
                    var sFormattedEndDate = oDateTimeFormat.format(oEndDate);
                    var description;
                    var metric;
                    description = sap.ui.getCore().byId("goalDescription").getValue()
                    metric = ""
                    if (description == "Waste") {
                        metric = "Tones"
                    }
                    else if (description == "Energy") {
                        metric = "KW"
                    }
                    else if (description == "Material") {
                        metric = "Tones"
                    }


                    let oNewGoal = {
                        Goalnr: sap.ui.getCore().byId("goalId").getValue(),
                        StartDate: sFormattedStartDate,
                        EndDate: sFormattedEndDate,
                        Metric: metric,
                        Description: description,
                        Value: parseFloat(sap.ui.getCore().byId("goalValue").getValue()),
                        Werks: sPlantPath
                    };
                    // Call the OData service to create a new sustainability goal with callback functions for error and success
                    oModel.create("/SustainabilityGoalsSet", oNewGoal, {
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show(
                                "Goal creation successful"
                            );
                            oModel.refresh();
                            sap.ui.getCore().byId("GoalPopup").destroy();
                            location.reload();
                        },
                        error: function (oError) {
                            sap.m.MessageToast.show(
                                "Goal creation successful"
                            );
                            oModel.refresh();
                            sap.ui.getCore().byId("GoalPopup").destroy();
                            location.reload();
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
                    new sap.m.Label({ text: "Value" }),
                    new sap.m.Input({ type: "Number", id: "goalValue" }),
                    new sap.m.Label({ text: "Goal type:" }),
                    new sap.m.ComboBox("goalDescription", {
                        items: [
                            new sap.ui.core.Item({ key: "1", text: "Waste" }),
                            new sap.ui.core.Item({ key: "2", text: "Energy" }),
                            new sap.ui.core.Item({ key: "3", text: "Material" }),
                            // Add more items as needed
                        ],
                    }),
                ],
            });
            oDialog.open();
        },
        formatDate: function (sDate) {
            if (!sDate) return "";
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "MMM dd, yyyy" });
            return oDateFormat.format(new Date(sDate));
        },
        formatInt: function (value) {
            if (!value) return "";

            return parseFloat(value).toFixed(2);
        },
        determineColor: function (current, goal) {
            console.log("current", current)

            if (current < goal/2) {
                return "Error"; // or "Critical" if ValueState is not used
            } 
            else if (current < goal) {
                return "Critical"; // or "Critical" if ValueState is not used
            }
            else {
                return "Good"; // or "Good" if ValueState is not used
            }
        },

        determineColorOpposite: function (current, goal) {
            console.log("current", current)

            if (current > goal/2) {
                return "Error"; // or "Critical" if ValueState is not used
            } 
            else if (current > goal) {
                return "Critical"; // or "Critical" if ValueState is not used
            }
            else {
                return "Good"; // or "Good" if ValueState is not used
            }
        },

        mapOrdersToChartPoints: function (oData) {
            var aChartPoints = [];
            var firstDate, lastDate;
            var thresholdWater = 11;
            var thresholdWaterLine = [
                { x: 0, y: thresholdWater },
                { x: oData.results.length - 1, y: thresholdWater } // Assuming x=100 is your max value
            ];
            if (oData.results.length > 0) {
                // Assuming the orders are already sorted by date
                firstDate = oData.results[0].EndDate;
                lastDate = oData.results[oData.results.length - 1].EndDate;
                aChartPoints = oData.results.map(function (order, index) {
                    var color = parseFloat(order.WaterConsm) > thresholdWater ? "Error" : "Good"; // Set color based on thresholdWater
                    return {
                        x: index, // Transform this as needed
                        y: parseFloat(order.WaterConsm),
                        y1: parseFloat(order.CarbonEmssn),
                        color: color,
                    };
                });
            }

            var oChartModel = new sap.ui.model.json.JSONModel({
                ChartData: aChartPoints,
                FirstDate: firstDate,
                LastDate: lastDate,
                ThresholdWaterLine: thresholdWaterLine,
            });
            console.log("oChartModel", oChartModel);
            this.getView().setModel(oChartModel, "chartModel");
        },

        PieCharts: function (oData) {
            if (!oData) return;

            var oPieModel = new sap.ui.model.json.JSONModel({
                Energy_cons: oData.energy_cons,
                Energy_perc: oData.energy_perc,
                Mat_util: oData.mat_util,
                Renw_energ_cons: oData.renw_energ_cons,
                Waste_recyc: oData.waste_recyc,

            });
            this.getView().setModel(oPieModel, "pieModel");
        },

        chartGoals: function (oData) {
            var waste = ""
            var energy = ""
            var material = ""
            if (oData.results.length > 0) {
                // Assuming the orders are already sorted by date

                oData.results.map(function (goal, index) {
                    console.log("goal", goal)
                    if (goal.Description == "Waste") {
                        waste = parseFloat(goal.Value)
                    }
                    else if (goal.Description == "Energy") {
                        energy = parseFloat(goal.Value)
                    }
                    else if (goal.Description == "Material") {
                        material = parseFloat(goal.Value)
                    }
                });
            }

            var oGoalModel = new sap.ui.model.json.JSONModel({
                Waste: waste,
                Energy: energy,
                Material: material
            });
            this.getView().setModel(oGoalModel, "goalModel");
            console.log("chartGoals", oGoalModel)

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
            var oJsonModel2 = new sap.ui.model.json.JSONModel();
            var oJsonModel3 = new sap.ui.model.json.JSONModel();
            var that = this;
            var oFilter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sPlantPath);
            oModel.read("/OrdersSet", {
                filters: [oFilter],
                success: function (oData, response) {
                    // Success handling
                    console.log("Orders fetched:", oData);
                    oJsonModel.setData(oData);
                    that.mapOrdersToChartPoints(oData);
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
                    oJsonModel2.setData(oData);
                    that.chartGoals(oData);

                },
                error: function (oError) {
                    // Error handling
                    console.error("Error fetching goals:", oError);
                }
            });

            oModel.read("/MCData" + "('" + sPlantPath + "')", {
                success: function (oData, response) {
                    // Success handling
                    console.log("MCData fetched:", oData);
                    oJsonModel3.setData(oData);
                    that.PieCharts(oData);
                },
                error: function (oError) {
                    // Error handling
                    console.error("Error fetching MCData:", oError);
                }
            });

            this.getView().setModel(oJsonModel, "orders");
            this.getView().setModel(oJsonModel2, "goals");
            this.getView().setModel(oJsonModel3, "charts");
            console.log("oJsonModel3", oJsonModel3)
            // this.mapOrdersToChartPoints(oJsonModel);

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