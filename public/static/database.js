var db = firebase.database();
var storage = firebase.storage();

var storageref = storage.ref();
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

        $('.file-input').on('change', function(e) {
            var file = e.target.files[0];
            $this.sendPicture(file);
        })
    },
    attachDataListers: function() {
        // messageref.on('value', function(snapshot) {
        //     var data = snapshot.val()
        //     console.log(data)
        // });

        messageref.on('child_added', function(snapshot) {
            var snap = snapshot.val()
            var isSelf = (snap.uid == currentUser.uid) ? 'self': '';
            var content = (!snap.image)? '<p>'+ snap.text +'</p>': '<img src=' + snap.image + ' />';
            var container = $('.messages');
            var photoURL = snap.user.photoURL || 'https://randomuser.me/api/portraits/men/79.jpg';

            var template = '<li class="message '+isSelf+'">' +
                    '<header>' +
                        '<img src="'+ photoURL +'"' +
                        '<h2>'+snap.user.displayName+'</h2>' +
                    '</header>' +
                    content +
                '</li>';
            container.append(template);
        });

    },
    sendMessage: function(message) {
        messageref.push({
            text: message,
            uid: currentUser.uid,
            user: {
                uid: currentUser.uid,
                photoURL: currentUser.photoURL,
                displayName: currentUser.displayName,
                email: currentUser.email
            }
        });
    },
    sendPicture: function(file) {
        // Create the file metadata
        var metadata = {
          contentType: 'image/jpeg'
        };
        var filename = guid();
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageref.child('images/' + filename).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function() {
            messageref.push({
                image: uploadTask.snapshot.downloadURL,
                uid: currentUser.uid,
                user: {
                    uid: currentUser.uid,
                    photoURL: currentUser.photoURL,
                    displayName: currentUser.displayName,
                    email: currentUser.email
                }
            });
        });
    }
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
