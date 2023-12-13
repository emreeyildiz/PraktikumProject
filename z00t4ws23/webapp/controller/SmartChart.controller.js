sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox',
    'sap/ui/comp/navpopover/LinkData',
    'sap/ui/core/util/MockServer',
    'sap/ui/core/Title',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/Image',
    'sap/m/Text',
    'sap/m/FlexItemData',
    'sap/ui/model/odata/v2/ODataModel'
], function (Controller, MessageBox, LinkData, MockServer, Title, SimpleForm, Image, Text, FlexItemData, ODataModel) {
    "use strict";

    return Controller.extend("z00t4ws23.controller.SmartChart", {

        onInit: function () {

            var oMockServer = new MockServer({
                rootUri: "sapuicompsmartchartwithPV/"
            });
            this._oMockServer = oMockServer;
            oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartchart/presentationVariant/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartchart/presentationVariant/mockserver/");
            oMockServer.start();

            // create and set ODATA Model
            this._oModel = new ODataModel("sapuicompsmartchartwithPV", true);
            this.getView().setModel(this._oModel);
        },

        onNavigationTargetsObtained: function (oEvent) {
            var oParameters = oEvent.getParameters();
            var oSemanticAttributes = oParameters.semanticAttributes;

            oParameters.show("Supplier", new LinkData({
                text: "Homepage",
                href: "http://www.sap.com",
                target: "_blank"
            }), [
                new LinkData({
                    text: "Go to shopping cart"
                })
            ], new SimpleForm({
                maxContainerCols: 1,
                content: [
                    new Title({
                        text: "Product description"
                    }), new Image({
                        src: "test-resources/sap/ui/documentation/sdk/images/HT-1052.jpg", // oSemanticAttributes.ProductPicUrl,
                        densityAware: false,
                        width: "50px",
                        height: "50px",
                        layoutData: new FlexItemData({
                            growFactor: 1
                        })
                    }), new Text({
                        text: oSemanticAttributes.Description
                    })
                ]
            }));
        },

        onNavigate: function (oEvent) {
            var oParameters = oEvent.getParameters();
            if (oParameters.text === "Homepage") {
                return;
            }
            MessageBox.show(oParameters.text + " has been pressed", {
                icon: MessageBox.Icon.INFORMATION,
                title: "SmartChart demo",
                actions: [
                    MessageBox.Action.OK
                ]
            });
        },

        onExit: function () {
            this._oMockServer.stop();
            this._oModel.destroy();
        }
    });
});
