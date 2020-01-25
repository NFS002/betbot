
$( function(){

    var sbox = $('#selector-box');
    var bookmaker = sbox.find('#select-bm :selected');
    var type = sbox.find('#select-type :selected');
    var btn = $('#btn-main');

    var validate = function() {

        if ( options.hasOwnProperty("started") && !options.hasOwnProperty("finished")  ) {
            // error
        }

        else {
            var bookmakername = bookmaker.val();
            /* Check we have the login details for the bookmaker */
            var account = getLogin( bookmakername );

            switch( bookmakername ) {
                case 'lb':
                    var preloginselector = bookmakers.lb.prelogin;
                    console.log( preloginselector )
                    console.log( $iframe[0] )
                    var el = $iframe.find( 'body' );
                    //removeBlankTarget( el );
                    console.log( el[0] )
                    el.click();
                    var username = getUsername( bookmakername )
                    var password = getPassword( bookmakername )
                    break;
                case 'wh':
                    break;
                default:

            }
        }
    }

    var getLogin = function( bookmaker ) {

        var res;

        $.post( urls.logins , { name: bookmaker })

        .done( function( data ) {
            Object.assign( res, data );
            // Display success dialog
        })

        .fail( function( err ) {
           if ( dev ) 
               console.log( err );
            // Display error dialog
        })
        
        return res;
    }

    var getUsername = function( name ) {

    }

    var getPassword = function( name ) {

    };



    (function(){
        btn.click( function() {

            var job = {
                "bm": bookmaker.val(),
                "type": type.val()
            };

            console.log( job )

            $.ajax({
                method: "POST",
                url: "/api/job",
                contentType: 'application/json', 
                data: JSON.stringify( job )
            })

            .done( function( res ) {
                console.log( 'Done!' + res );
            })

            .fail( function( jqXHR, err ) {
                console.log( err );
            });

        });

    })();
});
