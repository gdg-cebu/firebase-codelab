var login = {
    init: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                window.location = '/';
            } else {
                $('.login-section').removeClass('hidden');
            }
        });
        this.enableSocialSignIn();
        this.enableEmailSignUp();
        this.enableEmailSignIn();
    },

    enableEmailSignUp: function() {
        var form = $('.signup-form');
        form.on('submit', function(e) {
            e.preventDefault();
            var email  = form.find('input[name="email"]').val();
            var password = form.find('input[name="password"]').val();
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                $('.error').text('');
            }).catch(function(error) {
                var message = error.message;
                $('.error').text(message);
            });
        });
    },

    enableEmailSignIn: function() {
        var form = $('.signin-form');
        form.on('submit', function(e) {
            e.preventDefault();
            var email  = form.find('input[name="email"]').val();
            var password = form.find('input[name="password"]').val();
            firebase.auth().signInWithEmailAndPassword(email, password).catch(
                function(error) {
                var message = error.message;
                $('.error').text(message);
            }).then(function(user) {
                if (user) {
                    $('.error').text('');
                }
            });
        });
    },

    enableSocialSignIn: function() {
        $('.social-signins li').on('click', function(e) {
            if ($(this).hasClass('facebook')) {
                var provider = new firebase.auth.FacebookAuthProvider();
            } else {
                provider = new firebase.auth.GoogleAuthProvider();
            }
            firebase.auth().signInWithPopup(provider).then(function(result) {
                var user = result.user;
                if (user) {
                    console.log('wecome', user.email);
                    $('.error').text('');
                }
            }, function(error) {
                var message = error.message;
                $('.error').text(message);
            });

        });
    }, 
}

login.init();