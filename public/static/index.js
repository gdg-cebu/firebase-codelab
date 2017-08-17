var index = {
    init: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                window.location = '/login';
            } else {
                $('.chat').removeClass('hidden');
            }
        });
        this.enableLogout();
    },

    enableLogout: function() {
        $('.logout-btn').on('click', function(e) {
            firebase.auth().signOut();
        });
    }
}

index.init();