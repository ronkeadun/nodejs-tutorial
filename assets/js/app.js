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

//Varables
let LIST, id;

//get items from local storage
let data = localStorage.getItem("TODO");

//check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length; //set the id to the last item in the list
  loadList(LIST); //load the list to the user interface
} else {
  //if data is empty
  LIST = [];
  id = 0;
}

//load items to the user's interface
function loadList(array) {
  array.forEach(item => {
    addTodo(item.name, item.id, item.done, item.trash);
  });
}

//clear the local storage
clear.addEventListener("click", function() {
  localStorage.clear();
  location.reload();
});

//Show Today's date
const options = {
  weekday: "long",
  month: "short",
  day: "numeric"
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
  const item = `<li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>
                `;
  const position = "beforeend";
  list.insertAdjacentHTML(position, item);
}

//add items to the list when user clicks enter key
document.addEventListener("keyup", function(event) {
  if (event.keyCode == 13) {
    const toDo = input.value;
    //if input is not empty
    if (toDo) {
      addTodo(toDo, id, false, false);
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false
      });
      //add items to local storage(this code must be added everywhere the LIST array is updated)
      localStorage.setItem("TODO", JSON.stringify(LIST));
      id++;
    }
    input.value = "";
  }
});

//complete todo
function completeTodo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

//remove to do items
function removeTodo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
}

//target the items created dynamically
list.addEventListener("click", function(event) {
  const element = event.target; //returns the clicked element in the list items
  const elementJob = element.attributes.job.value; //returns complete or delete
  console.log(event.target);
  console.log(elementJob);

  if (elementJob == "complete") {
    completeTodo(element);
  } else if (elementJob == "delete") {
    removeTodo(element);
  }
  //add items to local storage(this code must be added everywhere the LIST array is updated)
  localStorage.setItem("TODO", JSON.stringify(LIST));
});
