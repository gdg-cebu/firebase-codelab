var index = {
    init: function() {
        var _this = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                window.location = '/login';
            } else {
                $('.chat').removeClass('hidden');
                _this.enableVerificationEmail();
            }
        });
        this.enableLogout();
    },

    enableLogout: function() {
        $('.logout-btn').on('click', function(e) {
            firebase.auth().signOut();
        });
    },

    enableVerificationEmail: function() {
        var user = firebase.auth().currentUser;
        if (user.emailVerified === false) {
            $('.alert').removeClass('hidden');
        }

        $('.resend-link').on('click', function(e) {
            e.preventDefault();
            user.sendEmailVerification().then(function() {
                $('.resend-link').text('sent');
            }).catch(function(error) {
                console.error(error);
            });
        })
    }
}

index.init();