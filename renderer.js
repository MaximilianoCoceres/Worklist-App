const userInput = document.getElementById("userInput");
const list = document.getElementById("list");
const inputText = document.querySelector(".inputTask");
const stats = document.getElementById("stats");
let editIcon = document.querySelector(".editTask");
const deleteIcon = document.querySelector(".trashBtn");
const modal = document.getElementById("myModal");
var closeModal = document.getElementsByClassName("close")[0];
const modalContent = document.querySelector(".modal-content");
const modalForm = document.getElementById("modalForm");

let lists = [];

userInput.addEventListener("submit", (event) => {
  event.preventDefault();
  var formData = new FormData(userInput);
  var inputValue = formData.get("inputTask");
  addTask(inputValue);
});

document.addEventListener("DOMContentLoaded", printTasks); //Eliminas la funcion eventListeners y te ahorras una funcion

//una funcion para generar un numero random, te va a funcionar como id y evitarte conflictos
function getId() {
  return (+new Date()).toString(36).slice(-8);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

//////////

let addTask = (input) => {
  const newValue = {
    id: getId(),
    name: input,
    completed: false, //trabaja sobre esta linea
  };

  if (inputText.value === "") {
    showError("The field is empty");
  } else {
    updateStats();
    inputText.value = "";
  }

  lists = [...lists, newValue];
  setStorage(lists);
  createHtml(newValue); //le pasas newValue, no el valor del input
};

function setStorage(items) {
  lists = [...items]; //sincronizas lists. **leer cometario de deletetask
  localStorage.setItem("tasks", JSON.stringify(items));
}

//Te conviene ser descriptivo con el nombre de las funciones
function printTasks() {
  removeAllChildNodes(list)

  if (localStorage.getItem("tasks")) {
    lists = JSON.parse(localStorage.getItem("tasks"));
    for (let tarea of lists) {
      createHtml(tarea);
    }
  }
}

let deleteTask = (id) => {
  document.getElementById(id).remove();
  let newlistsInLocalSotrage = lists.filter((task) => task.id != id);
  setStorage(newlistsInLocalSotrage); //sino sincronizas lists al hacer set vas a iterar sobre un lists "viejo", no podrias eliminar mas de uno
  updateStats();
};

function completeTask(id) {}

function createHtml(tarea) {
  list.innerHTML += `
  <div class="task__container" id="${tarea.id}">
    <div class = "tarea__container">
      <label for="" class="textTarea">
      <input type="checkbox">
          ${tarea.name}
      </label>
    </div>
    <span class="fa-solid fa-pen editTask" onclick= "editTask('${tarea.id}')"></span>
    <span class="fa-solid fa-trash-can trashBtn"></span>
  </div>`;
}

function editTask(id) {
  modal.style.display = "block";
  var filtrarId = lists.filter((element) => {
    return element.id == id;
  });

  var inputEditID = document.createElement("input");
  var inputEdit = document.createElement("input");
  inputEdit.placeholder = filtrarId[0].name;
  inputEdit.name = "inputEdit";
  inputEditID.value = filtrarId[0].id;
  inputEditID.type = "hidden";
  inputEditID.name = "inputEditID";
  modalContent.appendChild(inputEdit);
  modalContent.appendChild(inputEditID);
}

modalForm.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var formData = new FormData(modalForm);
  var inputValue = formData.get("inputEdit");
  var inputValueID = formData.get("inputEditID");
  lists[lists.findIndex((el) => el.id == inputValueID)].name = inputValue;
  setStorage(lists);
  modal.style.display = "none";
  printTasks();
  removeAllChildNodes(modalContent)
});

closeModal.addEventListener('click',()=>{
  modal.style.display = "none";
  removeAllChildNodes(modalContent)
})

function showError(err) {
  const messageError = document.createElement("p");
  messageError.textContent = err;
  messageError.classList.add("error");

  list.appendChild(messageError);

  setTimeout(() => {
    messageError.remove();
  }, 2000);
}

list.addEventListener("click", (event) => {
  if (event.target.nodeName === "INPUT") {
    updateStats();
  } else if (event.target.className === "fa-solid fa-trash-can trashBtn") {
    deleteTask(event.target.parentNode.id);
  }
});

let updateStats = () => {
  let pendientes = list.querySelectorAll(".tarea__container");
  let completadas = list.querySelectorAll('input[type="checkbox"]:checked');

  stats.innerHTML = `<p>
    Tareas pendientes: ${pendientes.length} Completadas:${completadas.length}
</p>`;

  if (pendientes.length == completadas && lists.length > 0) {
    console.log("tareas completadas!!");
  }
};
