chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        sendMessage(tabs[0].id, {"wtf": request.wtf,"wtr":request.wtr});
      });
    function sendMessage(tabId, message, callback){
      console.log("FBHsuccess - message received by background script");
      chrome.tabs.executeScript(tabId, {file: "script.js"}, function(){
        chrome.tabs.sendMessage(tabId, message, callback);
      });
    }
});