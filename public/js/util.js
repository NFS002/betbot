/* Utility functions and variables for general use */

var getLongName = function( sn ) {
    var shortName = sn.toLowerCase().trim().replace(' ', '')
    switch( shortName ) {
        case 'lb': return 'Ladbrokes';
        case 'wh': return 'William Hill';
    }
};

var getShortName = function( ln ) {
    var longName = ln.toLowerCase().trim().replace(' ', '')
    switch( longName ) {
        case 'ladbrokes': return 'lb';
        case 'williamhill': return 'wh';
    }
}

