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
                
            });
            this.getView().setModel(oViewModel, "view");
        },

        onFilterPlants: function (oEvent) {
            // build filter array
            var aFilter = [];
            
            var sQuery = oEvent.getParameter("newValue");
            if (oEvent.getParameter("query")) {
                sQuery = oEvent.getParameter("query")
            }
            if (sQuery) {
                aFilter.push(new Filter("Werks", FilterOperator.Contains, sQuery));
            }

            // filter binding
            var oList = this.byId("PlantList");
            var oBinding = oList.getBinding("items");
            console.log(oBinding.filter(aFilter));

            oBinding.filter(aFilter);
        },

        onPress: function (oEvent) {
            var oItem = oEvent.getSource();
            console.log("oItem", oItem);
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            console.log("number: ", oItem.getProperty("number"));
            console.log("numberUnit: ", oItem.getProperty("numberUnit"));
            // console.log("oItem: ", oItem.getBindingContext("Plant"));
            oRouter.navTo("detail",
                {
                    plantPath: window.encodeURIComponent(oItem.getProperty("numberUnit"))
                }
            );
            console.log("refesh time")
            location.reload();
        
        },

        formatWerks: function(sWerks) {
            var oView = this.byId("plantListItemId");
           
            this.byId("plantListItemId").addStyleClass("werksPlantListText");
            return sWerks;
        },

        formatName1: function(sName1) {
            return sName1;
        }
    });
});
