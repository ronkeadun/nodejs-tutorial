// SELECT ELEMENTS
const clear = document.querySelector(".clear");
const dateElement = document.querySelector("#date");
const list = document.querySelector("#list");
const input = document.querySelector("#input");
const notificationElement = document.querySelector(".notification");

//classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// console.log(axios);

const http = axios.create({
  baseURL: BASE_URL,
});
// addTodo(item.name, item.id, item.done, item.trash);

/*function fetchTodos(){
  return http.get("/todo/all").then((response) =>{
    return  response.data.map(todo=>{
      return {
        id: todo._id,
        name: todo.name,
        done:false,
        trash: false
      }
    })
  }).catch(error =>{
    console.log(error)
  })*/

async function fetchTodos() {
  try {
    const response = await http.get("/todo/all");
    return response.data.map((todo, index) => {
      return {
        id: index,
        docId: todo._id,
        name: todo.name,
        done: todo.done,
        trash: todo.trash,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

//Varables
let LIST, id;

//get items from local storage
let data = localStorage.getItem("TODO");

/*//check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length; //set the id to the last item in the list
  loadList(LIST); //load the list to the user interface
} else {
  //if data is empty
  LIST = [];
  id = 0;
}*/

//load server list
fetchTodos().then((items) => {
  if (items.length) {
    loadList(items);
  }
  LIST = items;
});

//load items to the user's interface
function loadList(array) {
  array.forEach((item) => {
    addTodo(item.name, item.id, item.done, item.trash);
  });
}

/*//clear the local storage
clear.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});*/

clear.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure you want to delete all todos?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.value) {
      // this is to clear all inputted and save data already existent in data storage
      await http.delete("/todo/delete");
      // this helps to refresh/reload the page when the refresh or clear icon is clicked on
      location.reload();
      // show a notification
      Swal.fire("Deleted!", "Your all todo has been deleted.", "success");
    }
  });
});

//Show Today's date
const options = {
  weekday: "long",
  month: "short",
  day: "numeric",
};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

//Add To Do Function
function addTodo(toDo, id, done, trash) {
  if (trash) {
    return;
  }
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";
  const item = `<li class="item" id="${id}">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}" id="todo${id}">${toDo}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                        <i class="fa fa-edit ed" job ="edit" id="todo${id}"></i>
                    </li>
                `;
  const position = "beforeend";
  list.insertAdjacentHTML(position, item);
}

//add items to the list when user clicks enter key
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    const toDo = input.value;
    //if input is not empty

    if (toDo) {
      //create todo and store on database
      http
        .post("/todo/create", {
          name: toDo,
        })
        .then((response) => {
          if (response.status === 200) {
            addTodo(toDo, id, false, false);
            LIST.push({
              name: toDo,
              id: id,
              done: false,
              trash: false,
            });
            id++;
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your TODO has been saved",
              showConfirmButton: true,
              timer: 10000,
            });
          }
          //else handle errors here
        })
        .catch((error) => {
          //handle request sending errors here
        });
      /*addTodo(toDo, id, false, false);
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
      });
      //add items to local storage(this code must be added everywhere the LIST array is updated)
      localStorage.setItem("TODO", JSON.stringify(LIST));
      id++;*/
    }
    input.value = "";
  }
});

//complete todo
function completeTodo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  // LIST[element.id].done = LIST[element.id].done ? false : true;

  const name = element.parentNode.querySelector(".text").innerText;
  const id = element.attributes.id.value;

  const done =
    element.classList.value == "fa co fa-check-circle" ? true : false;

  http.patch(`/todo/update/${id}`, {
    name,
    done,
  });
}

/*//remove to do items from local storage
function removeTodo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
}*/

//remove to do items from server
function removeTodo(element) {
  // const id = element.attributes.id.value;
  const todo = LIST[element.id];
  todo.trash = true;
  //display to the user to notify on ongoing background operation
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      http.delete(`/todo/delete/${todo.docId}`).then((response) => {
        element.parentNode.parentNode.removeChild(element.parentNode);
        // show a notification
      });
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
  /*// console.log(LIST), element.id;
  const todo = LIST[element.id];
  todo.trash = true;
  http.delete(`/todo/delete/${todo.docId}`).then((response) => {
    element.parentNode.parentNode.removeChild(element.parentNode);
    //show a notification that todo has been deleted
    console.log(response);
  });*/
}

async function MakeToDoEdit(element) {
  // display to user that something is going on
  const id = element.attributes.id.value;
  const name = element.parentNode.querySelector(".text").innerText;
  $(`p#${id}`).replaceWith(
    `<input type="text" id="ed${id}" class="text" value="${name}" style="margin: 5px auto 5px 55px; height:30px; font:16px;">`
  );

  $(`#ed${id}`).on("keyup", async (event) => {
    const newName = $(`#ed${id}`).val();
    if (event.keyCode == 13) {
      const newId = element.parentNode.attributes.id.value;
      const done =
        element.classList.value == "fa co fa-check-circle" ? true : false;

      await http
        .patch(`/todo/update/${newId}`, {
          name: newName,
          done,
        })
        .then((response) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your TODO has been saved",
            showConfirmButton: true,
            timer: 10000,
          });
        });

      $(`#ed${id}`).replaceWith(`<p class="text " id="${id}">${newName}</p>`);
    }
  });
}

//target the items created dynamically
list.addEventListener("click", function (event) {
  const element = event.target; //returns the clicked element in the list items
  const elementJob = element.attributes.job.value; //returns complete or delete
  console.log(event.target);
  console.log(elementJob);

  if (elementJob == "complete") {
    completeTodo(element);
  } else if (elementJob == "delete") {
    removeTodo(element);
  } else if (elementJob == "edit") {
    MakeToDoEdit(element);
  }

  /* //add items to local storage(this code must be added everywhere the LIST array is updated)
  localStorage.setItem("TODO", JSON.stringify(LIST));*/
});
