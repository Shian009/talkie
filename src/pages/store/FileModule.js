import firebase from 'firebase';
const FileModule = {
    state: {
        image_url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR8lN32ygpEJDuFsUrjjivhSgy8XA_TC4YtUX2b46ef_LONKam8',
        files: null,
        images:[]
    },
    getters: {
        image_url: state => state.image_url,
        files: state => state.files,
        images: state => state.images
    },
    mutations: {
        setImageURL(state, payload) {
            state.image_url = payload;
        },
        setFiles(state, payload) {
            state.files = payload;
        },
        setImages(state, payload) {
            state.images = payload;
        }
    },
    actions: {
        readFileMessage({commit}){
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                var file=files[i];
                if(!file.type.match("image")){
                    continue;
                }     
                var picReader = new FileReader();
                var images = []
                picReader.addEventListener('load',event =>{
                    var picFile = event.target;
                    images.push(picFile.result)
                });
                commit('setImages',images)
                picReader.readAsDataURL(file)           
            }
        },
        readFile({ commit }) {
            const files = event.target.files;
            commit('setFiles', files)
            const fileReader = new FileReader();
            let file = files[0];
            if (file['size'] < 200000) {
                fileReader.readAsDataURL(file)
                fileReader.addEventListener('load', () => {
                    var imageUrl = fileReader.result;
                    commit('setImageURL', imageUrl)
                })
            } else {
                commit('setAlertMessage', 'Image size is greater than 200KB')
                return
            }
        },
        uploadFile({commit,state}){
            return new Promise((resolve,reject)=>{
                var file = state.files[0]
                var storageRef =firebase.storage().ref('profile/'+file.name)
                var uploadTask = storageRef.put(file)
                
                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                  }, function(error) {
                    // Handle unsuccessful uploads
                    reject(error)
                  }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        resolve(downloadURL)
                    });
                  });
            })
        },
        uploadChatImages({commit},payload){
            return new Promise((resolve,reject)=>{
                var number= Math.random()
                var uniq_id = number.toString(36).substr(2,9)
                var storageRef =firebase.storage().ref('chat_images/'+uniq_id+'.png')
                var uploadTask = storageRef.putString(payload,'data_url',{
                    contentType:"image/png"
                })
                
                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                  }, function(error) {
                    // Handle unsuccessful uploads
                    reject(error)
                  }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        resolve(downloadURL)
                    });
                  });
            })
        }
    }

}
export default FileModule