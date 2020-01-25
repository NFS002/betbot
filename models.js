module.exports = {
    
    Account: function( Schema ) {
        return new Schema ( {

            first_name: String,

            last_name: String,

            email: {
                type: String,
                unique: true,
            },

            pw: String
        }) 
    },
 
    Job: function( Schema ) {
        return new Schema({
            bm: String,

            type: String,

            account: Number,

            un : {
                type: String,
                /*default: async function( ) {
                    var key = this.bm + '_un'
                    var logins = await this.model( 'Login' ).findOne( { account: this.account } ).lean();
                    return logins[ key ];
                }*/
            },

            pw : {
                type: String,
                /*default: function( ) {
                    var key = this.pw + '_pw'
                    var logins = this.model( 'Login' ).findOne( { account: this.account } );
                    return logins.select( key ).lean();
                }*/
            },

            created_at: {
                type: Date,

                default: Date.now()
            },

            started_at: {

                type: Date,

                default: null
            },

            completed_at: {

                type: Date,

                default: null
            }
        })
    },

    Login: function( Schema ) {

        return new Schema({

            account: Number,

            wh_un: String,

            wh_pw: String,

            lb_un: String,

            lb_pw: String
        })
    },

    getDefaultUn: async function( lModel, job ) {
        var uKey = job.bm + '_un'
        var login = await lModel.findOne( { account: job.account } ).lean();
        return login[ uKey ];

    },

    getDefaultPw: async function( lModel, job ) {
        var pKey = job.bm + '_pw'
        var login = await lModel.findOne( { account: job.account } ).lean();
        return login[ pKey ];
    }
}