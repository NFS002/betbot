$( function(){
    var box = $('#login-box');
    var btn = box.find('button')


    btn.click( function(){
        var email = btn.find('input[type=email]')
        var pw = btn.find('input[type=password]')
        location.href = '/home'
    })

});