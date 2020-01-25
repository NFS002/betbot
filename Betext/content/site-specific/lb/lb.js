$( window ).on( 'load', ( function(){
        // utility functions
        var jobs = await getFromStorage("jobs.lb")
        var path = location.pathname
        if ( !$.isEmptyObject( jobs ) && jobs.length > 0 ) {
                var job = jobs[0]

                tryLogin()
                checkForQuickDepositModal()
                checkForOddsBoostModal()
                checkForReviewModal()
                var freeBets = findFreeBets()
                if ( freeBets = 0 ) {
                        /* Error */
                }
                
                switch ( job.type ) {
                        case "matched":
                                switch ( job.state ) {
                                        case "new":

                                                switch ( path ) {
                                                        case '':
                                                        case '/':
                                                        login( job );
                                                        break;

                                                        default:
                                                        //clear cookies
                                                        location.href = 'https://sports.ladbrokes.com/'
                                                }     

                                        case "confirmed":
                                }
                }       
        }
        
        var updateStorage = function( job, cb ) {
                chrome.storage.sync.set( { "job.lb": job }, cb )
        }

        var tryLogin = function( job ) {
                var loginButton = $('.button.login-button')
                if ( loginButton.exists() ) {
                        loginButton.click();

                }
                return false;
                console.log( 'called login')
                var inp_un = $('#username');
                var inp_pw = $('#password');
                var btn_login = $('.button.login');
                inp_un.attr( 'value', job.un )
                inp_pw.attr( 'value', job.pw )
                btn_login.click();
        }

        chrome.storage.sync.get( "job", function( obj ) {
                if ( !$.isEmptyObject( obj )  ) {
                        var job = obj.job;
                        switch ( job.state ) {
                                case "begin":
                                        job.state = "logged"
                                        var btn_deposit = $('.button.deposit.trigger-balance');
                                        if ( btn_deposit.length === 0 )
                                                login( job );
                                        console.log( 'We are ready for action' )
                                
                                break;
                                default:
                        }
                }   
        });

        var findMaxStake = function() {

        }

        var checkForQuickDepositModal = function() {
                var modalBody = $('div.modal-body')
                if ( modalBody.exists() && modalBody.children().length > 1 ) {
                        var cancelButton = modalBody.find('span:contains("Cancel")');
                        if ( cancelButton.exists() )
                                cancelButton.click();

                }
        }

        var checkForOddsBoostModal = function() {
                var modalBody = $('div.modal-body')
                if ( modalBody.exists() ) {
                        var closeButton = modalBody.find('a.btn-close');
                        if ( closeButton.exists() )
                                closeButton.click();

                }
        }

        var checkForReviewModal = function() {
                var reviewModal = $('.qubit-AdvancedModal-box')
                if ( reviewModal.exists() ) {
                        var reviewClose = $('.qubit-AdvancedModal-close')
                        if ( reviewClose.exists() )
                                reviewClose.click()
                }
        }

        var findFreeBets = function() {
                var menuButton = $('a.menu-button')
                menuButton.click()
                var freeBetsLink = $('li.freeBets')
                if ( freeBetsLink.exists() ) {
                        var currencySpan = $('span[data-crlat=freeBetCount]')
                        if ( currencySpan.exists() )
                                return Number(currencySpan.text().replace(/[^0-9.-]+/g,""));
                        else return 0
                }
                else return 0
        }



        let getFromStorage = key => new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result => resolve(result)));
}));