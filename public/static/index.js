var currentUser = null;
var index = {
    init: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                window.location = '/login.html';
            } else {
                $('.chat').removeClass('hidden');
                currentUser = user;
                // database init
                var photo = currentUser.photoURL || 'https://randomuser.me/api/portraits/men/79.jpg';
                $('.user-avatar').attr('src', photo);
                database.init();
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
