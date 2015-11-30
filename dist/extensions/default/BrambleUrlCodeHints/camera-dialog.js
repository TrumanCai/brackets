define(function(require,exports,module){"use strict";var Dialog=brackets.getModule("widgets/Dialogs");var selfieDialogHTML=require("text!dialog.html");var Camera=require("camera/index");var DIALOG_BTN_CANCEL="cancel";var DIALOG_BTN_OK="ok";var DIALOG_BTN_CLASS_PRIMARY="primary";var DIALOG_BTN_CLASS_LEFT="left";var dialogBtns={buttons:[{className:DIALOG_BTN_CLASS_LEFT,dataId:DIALOG_BTN_CANCEL,text:"Cancel"},{className:DIALOG_BTN_CLASS_PRIMARY,dataId:DIALOG_BTN_OK,text:"Select Selfie",id:"selfie-use"}]};function CameraDialog(savePath){this._dialog=null;this.camera=null;this.savePath=savePath}CameraDialog.prototype.show=function(){var self=this;var deferred=new $.Deferred;selfieDialogHTML=Mustache.render(selfieDialogHTML,dialogBtns);this._dialog=Dialog.showModalDialogUsingTemplate(selfieDialogHTML);$("#selfie-use").attr("disabled",true);$("#selfie-close").on("click",function(){self.close();deferred.resolve()});this.camera=new Camera(deferred,this.savePath);this.camera.start();return deferred.promise()};CameraDialog.prototype.close=function(){this.camera=null;if(this._dialog){this._dialog.close();this._dialog=null}};module.exports=CameraDialog});