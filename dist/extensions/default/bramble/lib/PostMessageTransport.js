define(function(require,exports,module){"use strict";var _iframeRef,connId=1;var Launcher=require("lib/launcher"),Browser=require("lib/iframe-browser");var EventDispatcher=brackets.getModule("utils/EventDispatcher"),LiveDevMultiBrowser=brackets.getModule("LiveDevelopment/LiveDevMultiBrowser"),BlobUtils=brackets.getModule("filesystem/impls/filer/BlobUtils"),BrambleEvents=brackets.getModule("bramble/BrambleEvents"),Path=brackets.getModule("filesystem/impls/filer/BracketsFiler").Path;var PostMessageTransportRemote=require("text!lib/PostMessageTransportRemote.js");var Tutorial=require("lib/Tutorial");var MouseManager=require("lib/MouseManager");var LinkManager=require("lib/LinkManager");var XHRShim=require("text!lib/xhr/XHRShim.js");EventDispatcher.makeEventDispatcher(module.exports);function setIframe(iframeRef){if(iframeRef){_iframeRef=iframeRef}}function resolveLinks(message){var regex=new RegExp('\\"(blob:[^"]+)\\"',"gm");var resolvedMessage=message.replace(regex,function(match,url){var path=BlobUtils.getFilename(url);return['"',path,'"'].join("")});return resolvedMessage}function _listener(event){var msgObj;try{msgObj=JSON.parse(event.data)}catch(e){return}if(msgObj.type==="message"){if(LinkManager.isNavigationRequest(msgObj.message)){LinkManager.navigate(msgObj.message);return}if(MouseManager.isHighlightLineRequest(msgObj.message)){MouseManager.highlightLine(msgObj.message);return}if(MouseManager.isClearHighlightRequest(msgObj.message)){MouseManager.clearHighlight();return}if(msgObj.message){msgObj.message=resolveLinks(msgObj.message)}module.exports.trigger("message",[connId,msgObj.message])}else if(msgObj.type==="connect"){Browser.setListener()}}function start(){window.addEventListener("message",_listener);BrambleEvents.on("fileRemoved",reload);BrambleEvents.on("fileRenamed",reload)}function resolvePaths(message){var currentDoc=LiveDevMultiBrowser._getCurrentLiveDoc();if(!currentDoc){return message}var currentDir=Path.dirname(currentDoc.doc.file.fullPath);var linkRegex=new RegExp('(\\\\?\\"?)(href|src|url|value)(\\\\?\\"?\\s?:?\\s?\\(?\\\\?\\"?)([^\\\\"\\),]+)(\\\\?\\"?)',"gm");var resolvedMessage=message.replace(linkRegex,function(match,quote1,attr,seperator,value,quote2){var path=value.charAt(0)==="/"?value:Path.join(currentDir,value);var url=BlobUtils.getUrl(path);value=url===path?value:url;return[quote1,attr,seperator,value,quote2].join("")});return resolvedMessage}function send(idOrArray,msgStr){var win=_iframeRef.contentWindow;msgStr=resolvePaths(msgStr);var msg=JSON.parse(msgStr);var detachedPreview=Browser.getDetachedPreview();if(msg.method==="Page.reload"||msg.method==="Page.navigate"){reload();return}win.postMessage(msgStr,"*");if(detachedPreview&&Tutorial.shouldPostMessage()){detachedPreview.postMessage(msgStr,"*")}}function close(clientId){window.removeEventListener("message",_listener)}function getRemoteScript(){var currentDoc=LiveDevMultiBrowser._getCurrentLiveDoc();var currentPath;if(currentDoc){currentPath=currentDoc.doc.file.fullPath}return'<base href="'+window.location.href+'">\n'+"<script>\n"+PostMessageTransportRemote+"</script>\n"+"<script>\n"+XHRShim+"</script>\n"+MouseManager.getRemoteScript(currentPath)+LinkManager.getRemoteScript()}var _pendingReloadUrl;function reload(){var launcher=Launcher.getCurrentInstance();var liveDoc=LiveDevMultiBrowser._getCurrentLiveDoc();var url;if(!liveDoc){return}url=BlobUtils.getUrl(liveDoc.doc.file.fullPath);if(_pendingReloadUrl===url){return}_pendingReloadUrl=url;launcher.launch(url,function(){_pendingReloadUrl=null})}module.exports.getRemoteScript=getRemoteScript;module.exports.setIframe=setIframe;module.exports.start=start;module.exports.send=send;module.exports.close=close;module.exports.reload=reload});