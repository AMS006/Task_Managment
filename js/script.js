const state = {
    taskList: []
};

const taskContents = document.querySelector(".task-list");
const modalbody = document.querySelector(".modal-box");

const insertTask = ({ id, imgUrl, title, discp }) =>
    `
    <div class="col-lg-4 col-md-6  mt-3">
    <div class="task-items">
      <div class="task-header w-100 p-3  border-bottom text-white d-flex justify-content-between">
        <h3>${title}</h3>
        <div class="edit-delete-btn">
          <button class="edit-btn"  name = "${id}" onclick = "editTask.apply(this,arguments)">
            <span class="w-100 material-icons d-flex align-item-center"  name="${id}">mode_edit</span>
          </button>
          <button class="delete-btn" onclick = "deleteTask.apply(this,arguments)" name = "${id}">
            <span class="material-icons d-flex align-items-center" name = "${id}">delete</span>
          </button>
        </div>
      </div>
      <div class="task-content p-3 border-bottom">
        <div class="task-img">
          <img src="${imgUrl}" class="w-100"
            alt="">
        </div>
        <div class="task-img-discription py-2">
          <span class="text-white">${discp}</span>
        </div>
      </div>
      <div class="open-task p-3">
        <button class="open-task-btn py-2 px-3" onclick = "openModal.apply(this,arguments)" data-toggle="modal" name = "${id}"  data-target="#${id}">Open
          Task</button>
      </div>
    </div>
  </div>
    `
const taskModal = ({ id, imgUrl, title, discp }) =>{
    const date = new Date(parseInt(id));
    return  `
<div class="modal " id="${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">${title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="task-modal-body p-2">
              <div class="img">
                <img src="${imgUrl}" class="w-100"
                  alt="">
              </div>
              <div class="data mt-3" style="font-weight: bold; color:gray;">
                Created on <span>${date.toDateString()}</span>
              </div>
              <div class="discription mt-3">
                <h6>Dsicription : </h6>
                <p class="border p-2" style="font-size: 18px;">${discp}</p>
              </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div> 
`
}
const updatelocalstorage = () =>{
    localStorage.setItem(
        "tasks",JSON.stringify({tasks: state.taskList})
    );
    // console.log(state.taskList)
}
const loadData = () =>{
    const copystorage = JSON.parse(localStorage.tasks);
    // console.log(copystorage.tasks)
    if(copystorage)  state.taskList = copystorage.tasks;

    state.taskList.map((data) =>{
        taskContents.insertAdjacentHTML("beforeend",insertTask(data));
    })
}
const searhForTask = (data) =>{
    if(!data) data = window.event;
    console.log(data.target.value)
    while(taskContents.firstChild)
          taskContents.removeChild(taskContents.firstChild);
    
    const InputData = state.taskList.filter(({title}) => {
        return title.toLowerCase().includes(data.target.value.toLowerCase());
    })
    console.log(InputData);
    InputData.map((taskele)=>{
        taskContents.insertAdjacentHTML("beforeend",insertTask(taskele));
    })
}
const getData = (event) => {
    const id = `${Date.now()}`;
    const inputVal = {
        imgUrl: document.getElementById("imgUrl").value,
        title: document.getElementById("title").value,
        discp: document.getElementById("discp").value
    }

    // console.log(id, inputVal.imgUrl,inputVal.title, inputVal.discp);
    if (inputVal.title === "" || inputVal.discp === "") {
        alert("Plzz fill all mandatory field");
        return;
    }
    taskContents.insertAdjacentHTML("beforeend", insertTask({ ...inputVal, id }))

    state.taskList.push({ ...inputVal, id });
    updatelocalstorage();
}
const openModal = (e) => {
    // if(!e) e = window.event
    // console.log(e)
    // console.log(e.target.name)

    const findtask = state.taskList.find(({ id }) => id == e.target.name)
    modalbody.innerHTML = taskModal(findtask);
}
const editTask = (data) =>{
    const tagName = data.target.tagName;
    let parentNode,title,discp,savebtn;
    if(tagName === "BUTTON"){
        parentNode = data.target.parentNode.parentNode.parentNode;
    }
    else{
        parentNode = data.target.parentNode.parentNode.parentNode.parentNode
    }
    title = parentNode.childNodes[1].childNodes[1]
    discp = parentNode.childNodes[3].childNodes[3].childNodes[1]
    savebtn = parentNode.childNodes[5].childNodes[1];
    title.setAttribute("contenteditable","true");
    discp.setAttribute("contenteditable","true");

    savebtn.innerHTML = "Save Changes"

    savebtn.setAttribute("onclick", "saveEditedTask.apply(this,arguments)");
    savebtn.removeAttribute("data-target");
    savebtn.removeAttribute("data-toggle");
}
const saveEditedTask = (data) =>{
    const targetid = data.target.name;
    const parentNode = data.target.parentNode.parentNode

    let tasktitle,taskdiscp;

    tasktitle = parentNode.childNodes[1].childNodes[1].innerHTML;
    taskdiscp = parentNode.childNodes[3].childNodes[3].childNodes[1].innerHTML;
    console.log(tasktitle,taskdiscp);
    console.log(targetid,data.target.id);
    let temptaskList = state.taskList;

   console.log(temptaskList);

   for(var i = 0;i<temptaskList.length ; i++){
        if(temptaskList[i].id === targetid){
            temptaskList[i].title = tasktitle;
            temptaskList[i].discp = taskdiscp;
            break;
        }
   }
   state.taskList = temptaskList;
   updatelocalstorage();
   const btn = parentNode.childNodes[5].childNodes[1];
   title.setAttribute("contenteditable","false");
  discp.setAttribute("contenteditable","false");
  btn.setAttribute("onclick", "openModal.apply(this,arguments)");
  
  btn.setAttribute("data-toggle","modal");
  btn.setAttribute("data-target",`#${targetid}`)
  btn.innerHTML = "Open Task"
}
const deleteTask = (e) =>{
    
    const tagName = e.target.tagName;
    const id = e.target.getAttribute("name");
    console.log(id);
    const templist = state.taskList.filter((data) => data.id !== id);

    state.taskList = templist;
    updatelocalstorage();
    if(tagName === "BUTTON"){
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode)
    }
    else{
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode.parentNode)

    }
}