const taskslist = document.querySelector('.list');

const getList=()=>{
    db.collection('tasks').where("userid","==","QBj1e1lpZGMIUvk3Yb81h1aSVRL2").orderBy("timestamp").onSnapshot(snapshot => {
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
                <div data-id=${doc.id} class="checklistbox">
                    <div class="task">${taskdata.task}</div>
                    <div class="todo">${taskdata.todo}</div>
                    <div class="actions">
                        <input type="checkbox" name="tick" class="tick" id="" />
                        <button class="remove">X</button>
                    </div>
                </div>
            `;
            html += taskitem;
        });
        taskslist.innerHTML = html;

        const removebtn = document.querySelectorAll('.remove');

        removelisteners(removebtn);
    } else {
        taskslist.innerHTML = '<h5>Sorrry</h5>';
    }
}
//adding listeners to all remove btns
function removelisteners(btns){
    btns.forEach(btn=>{
        btn.addEventListener('click',deletetaskdoc);
    })
}
//delete from db func
const deletetaskdoc = (e)=>{
    e.preventDefault();
    const id = e.target.closest(".checklistbox").dataset.id ; 
    db.collection('tasks').doc(id).delete();
}
