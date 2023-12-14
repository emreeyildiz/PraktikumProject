sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
    'use strict'
    return Controller.extend("z00t4ws23.controller.PlantList", {
        formatter: formatter,

        onInit: function () {
            var oViewModel = new JSONModel({
                currency: "EUR"
            });
            this.getView().setModel(oViewModel, "view");
        },

        onFilterPlants: function (oEvent) {

            // build filter array
            var aFilter = [];
            console.log(oEvent)
            var sQuery = oEvent.getParameter("newValue");
            if (oEvent.getParameter("query")) {
                sQuery = oEvent.getParameter("query")
            }
            console.log(sQuery)
            if (sQuery) {
                aFilter.push(new Filter("Name1", FilterOperator.Contains, sQuery));
            }
            console.log(aFilter);
            // filter binding
            var oList = this.byId("PlantList");
            var oBinding = oList.getBinding("items");
            console.log(oList)
            console.log(oBinding)
            console.log(oBinding.filter(aFilter));
        },

        onPress: function (oEvent) {

            var oItem = oEvent.getSource();

            console.log("oItem", oItem);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            console.log("oItem1:", oItem.getProperty("number").substr(1));
            // console.log("oItem: ", oItem.getBindingContext("Plant"));
            oRouter.navTo("detail",
                {
                    plantPath: window.encodeURIComponent(oItem.getProperty("number"))
                }
            );
            console.log("refesh time")
            location.reload();

        }
    });
});
