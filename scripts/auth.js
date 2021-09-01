var provider = new firebase.auth.GoogleAuthProvider();

const loginfunc = ()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user.email;
        // document.querySelector('.loginpage').classList.add('hidden');
        // document.querySelector('.homepage').classList.remove('hidden');
        document.querySelector('.loginpage').style.display='none';
        document.querySelector('.homepage').style.display='flex';
        console.log(user);
        // ...
    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

const signoutfunc = ()=>{
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('signout success');
        // document.querySelector('.homepage').classList.add('hidden');
        // document.querySelector('.loginpage').classList.remove('hidden');
        document.querySelector('.loginpage').style.display='flex';
        document.querySelector('.homepage').style.display='none';
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
}

const loginbtn = document.querySelector('.loginbtn');
const logoutbtn = document.querySelector('.logoutbtn');

loginbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    loginfunc();
})

logoutbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    signoutfunc();
})