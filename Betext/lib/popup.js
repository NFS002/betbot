$( function() {

    var box = $('#running-status'),
    container = $('#page-container'),
    eB = $('#error-box'),
    eTB = $('#error-title'),
    eTM = $('#error-msg'),
    obj = {};

    chrome.tabs.query({ currentWindow: true, active: true}, function ( tabs ) {

        function _typeWriter( el, msg ){
            var h = el.html()
            var Ocontent = msg.split("");
            var i = 0;
            function show(){
                if (i < Ocontent.length ) {  
                    el.append( Ocontent[i] );
                    i++;
                };
            };
            var Otimer = setInterval( () => show(), 100);
        };
    
        
            
    
        jQuery.fn.typeWriter = function( msg ) {
            return _typeWriter( this, msg )
        };
    
        jQuery.fn.outerHTML = function() {
            return (this[0]) ? this[0].outerHTML : '';  
        };
    
        jQuery.fn.clickReff = function( url ) {
            return this.click( () => hreff( url ) )
        };
    
    
    
    
        var appendButton = function() {
            var btn = $('<button>');
            btn.text( 'Start' );
            btn.attr('id', 'start-btn')
    
            var opts = {
                warning: true,
    
                msg:  'This job could last for several' +
                ' days, and during that time you must keep this extension' +
                ' open in order for the job to continue. However, if you close' +
                ' it, your progress will be saved and you may continue later, although depending' +
                ' on the exact time of important events, this may lead to unexpected results.' +
                ' The job will start by emptying your cache and browser cookies.',
    
                buttons: {
                    'Continue': {
                        click: start  
                    }
                },
    
                home: true
            }
    
            btn.on( 'click', () => showError( opts ) );
            box.append( btn );
        }
    
        var startJob = function() {
            obj.state = "begin"
            $('#status-keyword').text( 'Running ' )
            $('#start-btn').remove();
            var div = $('<div>').addClass( 'status-icon' )
            box.append( div );
            $.ajax({
                url: 'http://localhost:8081/api/job/start?jobId=' + obj._id,
                complete: function( xhr ) {
                    console.log( 'Status: ' + xhr.status )
                }
            })
        }
    
    
        var clearBrowsingData = function( cb ) {
            chrome.browsingData.remove(
                { "origins": ["https://www.ladbrokes.com"] }, 
                { "cache": true, "cacheStorage": true,
                "cookies": true} , cb );
        }
    
        var start = function() {
            toggleClasses();
            clearStatuses();
            startJob();
            //loading
            clearBrowsingData( () => {  
                // end loading
                appendStatus( 'Cleared cache and cookies');
                var url = 'https://sports.ladbrokes.com/en-gb/';
                appendStatus( 'Entering ' + url);
                sendMessage( obj, () => {
                    hreff( url );
                });
            });
        }
    
        var sendMessage = function( msg, cb ) {
            console.log( msg );
            chrome.storage.sync.set( { job: msg }, cb )
        }
          
        var toggleClasses = function( ) {
            container.toggleClass( 'error' )
            eB.toggleClass( 'active' )
        }
    
        var _clearErr = function( ) {
            if (  $('#error-icon').hasClass( 'warning' ) )
                $('#error-icon').removeClass( 'warning' ) 
            eTB.empty();
            eTM.empty();
        }
    
    
        var showError = function( opts ) {
    
            _clearErr();
    
            toggleClasses();
            if ( opts.hasOwnProperty( 'warning') && opts.warning === true ) {
                $('#error-icon').addClass( 'warning' )
            }
    
            else if (  $('#error-icon').hasClass( 'warning' ) )
                $('#error-icon').removeClass( 'warning' )
    
            
            if ( opts.hasOwnProperty( 'msg') ) {
                var span = $('<span>');
                eTM.append( span );
                span.text( opts.msg )
                if ( opts.msg.length > 40 ) {
                    span.addClass( 'warning');
                }
            }
            
    
            if ( opts.hasOwnProperty( 'title') ) 
                eTB.text( opts.title )
        
    
            if ( opts.hasOwnProperty( 'check') && opts.check === true ) {
                var span = $('<span>').addClass( 'check' )
                var check = $('<input>').attr('type', 'checkbox')
                var h = 'Do not show this message again <br>' + check.outerHTML();
                eTM.append( span );
                span.html( h );
            }
    
    
            
            if ( opts.hasOwnProperty( 'buttons') ) {
                for( bKey in opts.buttons ) {
                    
                    var button = $('<button>').addClass( 'error-button' );
                    
                    var bOpts = opts.buttons[bKey]
                    
                    button.text( bKey );
                
                    if ( bOpts.hasOwnProperty( 'link') )
                        button.clickReff( bOpts.link );
                    else if ( bOpts.hasOwnProperty( 'click' ) ) 
                        button.click( bOpts.click );
                    if ( bOpts.hasOwnProperty( 'class' ) )
                        button.addClass( bOpts.class );
                    if ( bOpts.hasOwnProperty( 'id' ) )
                        button.attr( 'id', bOpts.id );
                   
                    
                
                    eTM.append( button );   
                }
            }
    
            if ( opts.hasOwnProperty('home')) {
                var button = $('<button>').addClass( 'error-button' );
                button.text( 'Return to home' );
                button.clickReff( 'http://localhost:8081' );
                button.click( toggleClasses )
                eTM.append( button );   
            }
        }
    
        var resetError = function( opts ) {
            toggleClasses();
            if (  $('#error-icon').hasClass( 'warning' ) )
                $('#error-icon').removeClass( 'warning' )
            if ( eTM.hasClass( 'warning' ) )
                eTM.removeClass( 'warning' )
            eTM.empty();    
        }
    
        
    
        var appendStatus = function( msg, d ) {
    
            var sB = $('.status-box');
    
            var sK = $('<div>').addClass('running-status-key');
    
            var sV = $('<div>').addClass('running-status-value');
            
            if ( !d || !d.length )
                d = new Date().toLocaleString();
    
            sV.text( d );
    
            sK.html( msg + sV.outerHTML() );
    
            sB.append( sK );
    
        }
    
        var clearStatuses = function(  ) {
            $('.running-status-key').remove();
        }
    
        var updateClock = function( ) {
            var clock = $('#clock')
            var today = new Date().toLocaleTimeString();
            clock.text( today );
        }
    
        var hreff = function( url ) {
            chrome.tabs.update( tabs[0].id, {url: url });
        }
    
        
        $.ajax({
            method: "GET",
            url: "http://localhost:8081/api/job/get?accountId=1",
            dataType: "json"
        })
    
        .done( function( res ) {
            $('#btn-home').clickReff(  'http://localhost:8081'  );
            Object.assign( obj, res.job )
            var span1 = $( '<span>' )
            span1.attr( 'id', 'status-keyword' )
            if ( obj.created_at && obj.created_at.length )
                span1.text( 'Paused ')
            else
                span1.text( 'Pending ');
            box.append( span1 );
            var span2 = $( '<span>' )
            var msg = obj.type + ' bet on ' + obj.bm;
            span2.text(  msg );
            box.append( span2 );
            var t = setInterval( () => updateClock( ), 500 );
            appendButton();
            var d = new Date( obj.created_at );
            appendStatus( 'Job created at', d.toLocaleString() );
        })
    
        .fail( function( jqXHR, err ) {
    
            var opts = {
                title: 500,
                msg: 'Please try again later',
                check: true,
                home: true
            }
    
            showError( opts )
        });

    });    
});