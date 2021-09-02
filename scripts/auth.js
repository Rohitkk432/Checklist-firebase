var provider = new firebase.auth.GoogleAuthProvider();

var user;

const loginfunc = ()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        user = result.user;

        document.querySelector('.loginpage').style.display='none';
        document.querySelector('.homepage').style.display='flex';

        document.querySelector('.welcomeuser').textContent=`Welcome ${user.displayName} `

        getList();

        // console.log(user.uid);
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



//adding new listitem

const addlist = document.querySelector('.add-list');
const addbtn = document.querySelector('.addbtn');

addbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const html=`
        <div class="checklistbox-add">
            <input class="inp-task inp" type="text" />
            <input class="inp-todo inp" type="text" />
            <div class="actions">
                <input type="checkbox" name="tick" class="tick-add" id="" />
                <button class="remove-add">X</button>
            </div>
        </div>
        <button class='submitadd'>Add</button>
    `;
    addlist.innerHTML=html;

    const submitadd = document.querySelector('.submitadd');
    submitadd.addEventListener('click',(e)=>{
        e.preventDefault();
        const task= document.querySelector(".inp-task").value;
        const todo= document.querySelector(".inp-todo").value;
        const checked = document.querySelector(".tick-add").checked;
        db.collection('tasks').add({
            userid:user.uid,
            task:task,
            todo:todo,
            checked:checked,
            timestamp: new Date().getTime()
        });
        addlist.innerHTML=``;
    })
    
    const removebtn = document.querySelector('.remove-add');
    removebtn.addEventListener('click',(e)=>{
        e.preventDefault();
        addlist.innerHTML=``;
    })
})