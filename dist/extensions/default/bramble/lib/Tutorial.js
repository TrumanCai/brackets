define(function(require,exports,module){"use strict";var LiveDevelopment=brackets.getModule("LiveDevelopment/LiveDevMultiBrowser");var StartupState=brackets.getModule("bramble/StartupState");var EditorManager=brackets.getModule("editor/EditorManager");var BrambleEvents=brackets.getModule("bramble/BrambleEvents");var Filer=brackets.getModule("filesystem/impls/filer/BracketsFiler");var Path=Filer.Path;var PostMessageTransport=require("lib/PostMessageTransport");var _tutorialOverride;var _forceReload;function setOverride(val){_tutorialOverride=!!val;if(_tutorialOverride){_forceReload=true;PostMessageTransport.reload()}else{LiveDevelopment.close().done(LiveDevelopment.open)}BrambleEvents.triggerTutorialVisibilityChange(_tutorialOverride)}function getOverride(){return _tutorialOverride}function getPath(){return Path.join(StartupState.project("root"),"tutorial.html")}function exists(callback){Filer.fs().stat(getPath(),function(err,stats){callback(stats&&stats.type==="FILE")})}function _tutorialInEditor(){var editor=EditorManager.getCurrentFullEditor();if(!editor){return false}return getPath()===editor.document.file.fullPath}function shouldReload(){if(_forceReload){_forceReload=false;return true}return getOverride()&&_tutorialInEditor()}function shouldPostMessage(){return getOverride()&&_tutorialInEditor()}exports.setOverride=setOverride;exports.getOverride=getOverride;exports.getPath=getPath;exports.exists=exists;exports.shouldReload=shouldReload;exports.shouldPostMessage=shouldPostMessage});