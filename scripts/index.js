var provider = new firebase.auth.GoogleAuthProvider();

var user;

//login func
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
//signout
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

// --------------------------------------------------------------

//adding new listitem

const addlist = document.querySelector('.add-list');
const addbtn = document.querySelector('.addbtn');

addbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const html=`
        <div class="checklistbox-add">
            <input placeholder="task/item" class="inp-task inp" type="text" />
            <input placeholder="todo" class="inp-todo inp" type="text" />
            <div class="actions-add">
                <input type="checkbox" name="tick" class="tick-add" id="" />
                <button class="remove-add"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <button class='submitadd'><i class="fas fa-plus"></i></button>
    `;
    addlist.innerHTML=html;

    const submitadd = addlist.querySelector('.submitadd');
    submitadd.addEventListener('click',(e)=>{
        e.preventDefault();
        const task= addlist.querySelector(".inp-task").value;
        const todo= addlist.querySelector(".inp-todo").value;
        const checked = addlist.querySelector(".tick-add").checked;
        if(task){
            db.collection('tasks').add({
                userid:user.uid,
                task:task,
                todo:todo,
                checked:checked,
                timestamp: new Date().getTime()
            });
        }
        addlist.innerHTML=``;
    })
    
    const removebtn = addlist.querySelector('.remove-add');
    removebtn.addEventListener('click',(e)=>{
        e.preventDefault();
        addlist.innerHTML=``;
    })
});

//fetching and displaying checklists
const taskslist = document.querySelector('.list');

const getList=()=>{
    db.collection('tasks').where("userid","==",user.id).orderBy("timestamp").onSnapshot(snapshot => {
        // console.log(snapshot.docs);
        setList(snapshot.docs);
    }, err => console.log(err.message));
}
//setting data to display
const setList=(data)=>{
    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const taskdata = doc.data();
            const taskitem = `
                <div class="listbox">
                    <div data-id=${doc.id} class="checklistbox">
                        <div class="task">${taskdata.task}</div>
                        <div class="todo">${taskdata.todo}</div>
                        <div class="actions">
                            <input type="checkbox" name="tick" class="tick" id="" ${(taskdata.checked)? 'checked':''}/>
                            <button class="remove"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <button class='updatebtn'><i class="fas fa-pen"></i></button>
                </div>
            `;
            html += taskitem;
        });
        taskslist.innerHTML = html;

        const removebtn = document.querySelectorAll('.remove');
        const updatebtn = document.querySelectorAll('.updatebtn');

        removelisteners(removebtn);
        updatelisteners(updatebtn);
    } else {
        taskslist.innerHTML = '<div class="checklistbox" style="justify-content:center" >Sorry No task to display</div>';
    }
}
//adding listeners to all remove btns
function removelisteners(btns){
    btns.forEach(btn=>{
        btn.addEventListener('click',deletetaskdoc);
    })
}
//adding listeners to all update btns
function updatelisteners(btns){
    btns.forEach(btn=>{
        btn.addEventListener('click',(e)=>updateform(e));
    })
}
//delete from db func
const deletetaskdoc = (e)=>{
    e.preventDefault();
    const id = e.target.closest(".checklistbox").dataset.id ; 
    db.collection('tasks').doc(id).delete();
}

//update 
const updateform = (e)=>{
    e.preventDefault();
    //previous values

    const id = e.target.closest(".listbox").querySelector(".checklistbox").dataset.id;
    const editlistbox = e.target.closest(".listbox");
    const editlist = e.target.closest(".listbox").querySelector(".checklistbox");
    const prevtask = editlist.querySelector('.task').textContent;
    const prevtodo = editlist.querySelector('.todo').textContent;
    const prevchecked = editlist.querySelector('.tick').checked;
    
    //layout for update
    const html=`
        <div class="checklistbox-add">
            <input placeholder="task/item" value='${prevtask}' class="inp-task inp" type="text" />
            <input placeholder="todo" value='${prevtodo}' class="inp-todo inp" type="text" />
            <div class="actions-add">
                <input type="checkbox" name="tick" class="tick-add" id="" ${(prevchecked)? 'checked':''}/>
                <button class="remove-add"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <button class='save-btn'><i class="far fa-save"></i></button>
    `;

    editlistbox.innerHTML=html;

    const removebtn = editlistbox.querySelector('.remove-add');
    removebtn.addEventListener('click',(e)=>{
        e.preventDefault();
        editlistbox.innerHTML=``;
        getList();
    })

    //edit func
    editlistbox.querySelector('.save-btn').addEventListener('click',(e)=>{
        e.preventDefault();
        const uptask= editlistbox.querySelector(".inp-task").value;
        const uptodo= editlistbox.querySelector(".inp-todo").value;
        const upchecked = editlistbox.querySelector(".tick-add").checked;
        if((uptask)&&((uptask!==prevtask)||(upchecked!==prevchecked)||(uptodo!==prevtodo))){
            db.collection('tasks').doc(id).update({
                task:uptask,
                todo:uptodo,
                checked:upchecked
            });
        }else{
            getList();
        }
    })
}