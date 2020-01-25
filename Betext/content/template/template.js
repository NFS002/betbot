chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ( request.hasOwnProperty("state") && request.state == "begin") {
            chrome.storage.sync.set( { job: request }, function() {
                this.location.href = request.url
        })
    }
});