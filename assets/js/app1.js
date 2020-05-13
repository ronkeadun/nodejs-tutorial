// select the Element
const clear = document.querySelector(".clear");
const list = document.getElementById("list");
const input = document.getElementById("input");
const dateElement = document.getElementById("date");

// selecting class names of font-awesome we can toggle with when carrying out actions on the to-do list
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

const http = axios.create({
  baseURL: BASE_URL,
});

async function fetchTodos() {
  try {
    const response = await http.get("/todo/all");
    return response.data.map((todo, index) => {
      return {
        id: todo._id,
        name: todo.name,
        trash: todo.trash,
        done: todo.done,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

fetchTodos().then((response) => {
  if (response.length) {
    loadList(response);
  }
});

// function designed to load items from db to the user interface
function loadList(array) {
  array.forEach(function (item) {
    addToDo(item.name, item.id, item.done, item.trash);
  });
}

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
// to display today's date
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// this is the logic for the function to add a todo  to the already existing list
function addToDo(todo, id, done, trash) {
  // this block of code indicates that if the element has been deleted the code below does not run.
  if (trash) {
    return;
  }

  // this block of code seeks to check if the item on the todo list is either done or undone

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";
  const item = `<li class="item" id="${id}">
  <i class=" fa co ${DONE}" job="complete" id=${id}></i>
<p class="text ${LINE}" id="todo${id}">${todo}</p>
<i class="fa fa-trash-o de" job ="delete" id=${id}></i>
<i class="fa fa-edit ed" job ="edit" id="todo${id}"></i>
</li>`;

  const position = "beforeEnd";
  // inserting adjacent html,this is to make elements added into the todo list to aggregate upon each other on addition
  list.insertAdjacentHTML(position, item);
}

// this is designed to add an event listener which triggers when we add an item to the list using the enter key
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    const toDo = input.value;

    // if a todo is added the addtodo function is triggered it will add the todo to the list
    if (toDo) {
      http
        .post("/todo/create", {
          name: toDo,
        })
        .then((response) => {
          if (response.status == 200) {
            addToDo(toDo, response.data._id, false, false);

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your TODO has been saved",
              showConfirmButton: true,
              timer: 10000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // when empty
    input.value = "";
  }
});

// function designed to check if a particular todo is completed

function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  const name = element.parentNode.querySelector(".text").innerText;
  const id = element.attributes.id.value;

  const done =
    element.classList.value == "fa co fa-check-circle" ? true : false;

  http.patch(`/todo/update/${id}`, {
    name,
    done,
  });
}

// to remove a to do

function removeToDo(element) {
  // display to user that something is going on
  const id = element.attributes.id.value;

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
      http.delete(`/todo/delete/${id}`).then((response) => {
        element.parentNode.parentNode.removeChild(element.parentNode);
        // show a notification
      });
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
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

// an event listener designed to target items created dynamically

list.addEventListener("click", (event) => {
  const element = event.target; //return the clicked element inside the list

  if (element.attributes.job) {
    const elementJob = element.attributes.job.value; //this returns the custom set attributes in the items field i.e complete or delete and when set up a conditional that if the job is either complete or delete we use either the completeToDo or removeToDo functions respectively.

    if (elementJob == "complete") {
      console.log(event.target);
      completeToDo(element);
    } else if (elementJob == "delete") {
      console.log(event.target);
      removeToDo(element);
    } else if (elementJob == "edit") {
      console.log(event.target);
      MakeToDoEdit(element);
    }
    // add item to LocalStorage(this code must be added where the list array is updated)
  }
});
