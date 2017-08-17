var db = firebase.database();

var messageref = db.ref('/message');

var database = {
    init: function() {

        this.attachHtmlListeners();
        this.attachDataListers();
    },
    attachHtmlListeners: function() {
        var $this = this;
        $('.send-btn').on('click', function(e) {
            e.preventDefault();
            var message = $('.input-message').val();
            $this.sendMessage(message);
        });
    },
    attachDataListers: function() {
        // messageref.on('value', function(snapshot) {
        //     var data = snapshot.val()
        //     console.log(data)
        // });
        messageref.on('child_added', function(snapshot) {
            var snap = snapshot.val()

            var isSelf = (snap.uid == globalUser.uid) ? 'self': '';
            var body = snap.body;
            var container = $('.messages');

            var userref = db.ref('users/' + snap.uid);
            userref.once('value', function(snapshot) {
                var data = snapshot.val();
                var template = '<li class="message '+isSelf+'">' +
                        '<header>' +
                            '<img src="'+ data.photoURL +'"' +
                            '<h2>'+data.name+'</h2>' +
                            '<button class="delete-btn"></button>' +
                        '</header>' +
                        '<p>'+ body +'</p>' +
                    '</li>';
                container.append(template);
            });

        });

    },
    sendMessage: function(message) {
        messageref.push({
            body: message,
            uid: globalUser.uid
        });
    }
}
