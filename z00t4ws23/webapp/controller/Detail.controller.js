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
                    var oEndDate = oEndDatePicker.getDateValue();

                    // Use DateFormat to format the dates
                    var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm" });
                    var sFormattedEndDate = oDateTimeFormat.format(oEndDate);
                    var description;
                    var metric;
                    description = sap.ui.getCore().byId("goalDescription").getValue()
                    metric = ""
                    if (description == "Waste") {
                        metric = "Tons"
                    }
                    else if (description == "Energy") {
                        metric = "KW"
                    }
                    else if (description == "Material") {
                        metric = "Tons"
                    }


                    let oNewGoal = {
                        Goalnr: "1",
                        StartDate: "2020-01-01T00:00:00",
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
                title: "Create New Goal for Plant " + this.getView().getModel("viewModel").getProperty("/currentPlant"),
                modal: true,
                contentWidth: "25em", // Adjust width as necessary
                buttons: [saveButton, cancelButton],
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Deadline" })], justifyContent: "Start" }),
                            new sap.m.DatePicker({ id: "goalEndDate", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Value Percentage" })], justifyContent: "Start" }),
                            new sap.m.Input({ type: "Number", id: "goalValue", width: "100%", placeholder: "Enter a value between 0 and 100" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Goal type:" })], justifyContent: "Start" }),
                            new sap.m.ComboBox("goalDescription", {
                                width: "100%",
                                items: [
                                    new sap.ui.core.Item({ key: "1", text: "Waste" }),
                                    new sap.ui.core.Item({ key: "2", text: "Energy" }),
                                    new sap.ui.core.Item({ key: "3", text: "Material" }),
                                    // Add more items as needed
                                ]
                            })
                        ]
                    })
                ],
                layoutData: new sap.m.FlexItemData({ growFactor: 1 })
            }).addStyleClass("sapUiContentPadding");

            oDialog.open();

        },

        createNewOrder: function (oEvent) {

            console.log("createNewOrder");
            var sButtonId = oEvent.getSource().getId();
            console.log(sButtonId);
            let that = this;
            let cancelButton = new sap.m.Button({
                text: "Cancel",
                type: sap.m.ButtonType.Reject,
                press: function () {
                    sap.ui.getCore().byId("OrderPopup").destroy();
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

                    var werks = oViewModel.getProperty("/currentPlant");;
                    var oStartDatePicker = sap.ui.getCore().byId("startDatePicker");
                    var oEndDatePicker = sap.ui.getCore().byId("endDatePicker");

                    // Get the JavaScript Date objects from the DatePicker
                    var oStartDate = oStartDatePicker.getDateValue();
                    var oEndDate = oEndDatePicker.getDateValue();
                    var orderId = "1";
                    var enrgCons = sap.ui.getCore().byId("enrgConsInput").getValue();
                    var rnwEnrgCons = sap.ui.getCore().byId("rnwEnrgConsInput").getValue();
                    var waterCons = sap.ui.getCore().byId("waterConsInput").getValue();
                    var carbonFp = sap.ui.getCore().byId("carbonFpInput").getValue();
                    var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd'T'HH:mm" });
                    var sFormattedStartDate = oDateTimeFormat.format(oStartDate);
                    var sFormattedEndDate = oDateTimeFormat.format(oEndDate);

                    let oNewOrder = {
                        Ordernr: orderId,
                        Werks: werks,
                        StartDate: sFormattedStartDate,
                        EndDate: sFormattedEndDate,
                        EnergyConsm: parseFloat(enrgCons),
                        RnwEnergyConsm: parseFloat(rnwEnrgCons),
                        WaterConsm: parseFloat(waterCons),
                        CarbonEmssn: parseFloat(carbonFp)
                    };
                    // Call the OData service to create a new sustainability goal with callback functions for error and success
                    oModel.create("/OrdersSet", oNewOrder, {
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show(
                                "Order creation successful"
                            );
                            oModel.refresh();
                            sap.ui.getCore().byId("OrderPopup").destroy();
                            location.reload();
                        },
                        error: function (oError) {
                            sap.m.MessageToast.show(
                                "Order creation successful"
                            );
                            oModel.refresh();
                            sap.ui.getCore().byId("OrderPopup").destroy();
                            location.reload();
                        },
                    });
                    console.log(oNewOrder);
                },
            });

            let oDialog = new sap.m.Dialog("OrderPopup", {
                title: "Create New Order for Plant " + this.getView().getModel("viewModel").getProperty("/currentPlant"),
                modal: true,
                contentWidth: "25em", // Adjust width as necessary
                buttons: [saveButton, cancelButton],
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Start Date" })], justifyContent: "Start" }),
                            new sap.m.DatePicker({ id: "startDatePicker", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "End Date" })], justifyContent: "Start" }),
                            new sap.m.DatePicker({ id: "endDatePicker", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Energy Consumption" })], justifyContent: "Start" }),
                            new sap.m.Input({ type: "Number", id: "enrgConsInput", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Renewable Energy Consumption" })], justifyContent: "Start" }),
                            new sap.m.Input({ type: "Number", id: "rnwEnrgConsInput", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Water Consumption" })], justifyContent: "Start" }),
                            new sap.m.Input({ type: "Number", id: "waterConsInput", width: "100%" })
                        ]
                    }),
                    new sap.m.VBox({
                        items: [
                            new sap.m.HBox({ items: [new sap.m.Label({ text: "Carbon Footprint" })], justifyContent: "Start" }),
                            new sap.m.Input({ type: "Number", id: "carbonFpInput", width: "100%" })
                        ]
                    })
                ],
                layoutData: new sap.m.FlexItemData({ growFactor: 1 })
            }).addStyleClass("sapUiContentPadding");

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

            if (current < goal / 2) {
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

            if (current > goal / 2) {
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
            var thresholdWater = 23;
            var thresholdEnergy = 23;
            var thresholdCarbon = 23;
            var thresholdRenewable = 23;


            oData.results.map(function (order, index) {

            });

            var thresholdWaterLine = [
                { x: 0, y: thresholdWater },
                { x: oData.results.length - 1, y: thresholdWater } // Assuming x=100 is your max value
            ];
            if (oData.results.length > 0) {
                // Assuming the orders are already sorted by date
                firstDate = oData.results[0].EndDate;
                lastDate = oData.results[oData.results.length - 1].EndDate;

                // Calculate the mean values
                var meanWater = oData.results.reduce(function (sum, order) {
                    return sum + parseFloat(order.WaterConsm);
                }, 0) / oData.results.length;

                var meanCarbon = oData.results.reduce(function (sum, order) {
                    return sum + parseFloat(order.CarbonEmssn);
                }, 0) / oData.results.length;

                var meanEnergy = oData.results.reduce(function (sum, order) {
                    return sum + parseFloat(order.EnergyConsm);
                }, 0) / oData.results.length;

                var meanRenewable = oData.results.reduce(function (sum, order) {
                    return sum + parseFloat(order.RnwEnergyConsm);
                }, 0) / oData.results.length;


                aChartPoints = oData.results.map(function (order, index) {
                    var colorWater = parseFloat(order.WaterConsm) > meanWater ? "Error" : "Good"; // Set color based on thresholdWater
                    var colorEnergy = parseFloat(order.EnergyConsm) > meanEnergy ? "Error" : "Good"; // Set color based on thresholdWater
                    var colorCarbon = parseFloat(order.CarbonEmssn) > meanCarbon ? "Error" : "Good"; // Set color based on thresholdWater
                    var colorRenewable = parseFloat(order.RnwEnergyConsm) > meanRenewable ? "Error" : "Good"; // Set color based on thresholdWater
                    return {
                        x: index, // Transform this as needed
                        y: parseFloat(order.WaterConsm),
                        y1: parseFloat(order.CarbonEmssn),
                        y2: parseFloat(order.EnergyConsm),
                        y3: parseFloat(order.RnwEnergyConsm),

                        colorWater: colorWater,
                        colorEnergy: colorEnergy,
                        colorCarbon: colorCarbon,
                        colorRenewable: colorRenewable,
                    };
                });
            }
            var oChartModel = new sap.ui.model.json.JSONModel({
                ChartData: aChartPoints,
                FirstDate: firstDate,
                LastDate: lastDate,
                ThresholdWaterLine: thresholdWaterLine,
                MeanCarbon: Math.floor(meanCarbon),
                MeanEnergy: Math.floor(meanEnergy),
                MeanWater: Math.floor(meanWater),
                MeanRenewable: Math.floor(meanRenewable),
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
                Renw_energ_perc: oData.renw_energ_perc,

                Waste_recyc: oData.waste_recyc,
                Waste_util: oData.waste_util,
                Water_cons: oData.water_cons,
                Water_util: oData.water_util


            });
            this.getView().setModel(oPieModel, "pieModel");
        },

        chartGoals: function (oData) {
            var waste = "-1"
            var energy = "-1"
            var material = "-1"
            if (oData.results.length > 0) {
                // Assuming the orders are already sorted by date

                oData.results.map(function (goal, index) {
                    console.log("goal", goal)
                    if (goal.Description == "Waste" && waste == "-1") {
                        waste = parseFloat(goal.Value)
                    }
                    else if (goal.Description == "Energy" && energy == "-1") {
                        energy = parseFloat(goal.Value)
                    }
                    else if (goal.Description == "Material" && material == "-1") {
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
                    oData.results.sort(function (a, b) {
                        return parseInt(b.Goalnr, 10) - parseInt(a.Goalnr, 10);
                    });
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