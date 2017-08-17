var globalUser = null;
var index = {
    init: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                window.location = '/login.html';
            } else {
                $('.chat').removeClass('hidden');
                globalUser = user;
                // database init
                database.init();
            }
        });
        this.enableLogout();
    },

    enableLogout: function() {
        console.log('haha');
        $('.logout-btn').on('click', function(e) {
            console.log('haha2');
            firebase.auth().signOut();
        });
    }
}

index.init();
