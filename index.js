const addRef = document.querySelector("#add");
const modalRef = document.querySelector(".modal");
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskWrapperRef = document.querySelector(".task-wrapper");
const rightSectionRef = document.querySelectorAll(".right-section .category");
const textRef = document.querySelector(".left-section textarea");
const removeBtnRef = document.querySelector('#remove');
const taskSearchRef = document.querySelector('.tasks-search input');
renderList(tasks);

//HIDING OF TASK BOX OR CLICKING ADD ICON
addRef.addEventListener('click', function (e) {
    toggleModal();
})
function toggleModal() {
    const isHidden = modalRef.classList.contains('hide');
    if (isHidden) {
        modalRef.classList.remove('hide');
    }
    else {
        modalRef.classList.add('hide');
    }
}

//CREATING PRESS ENTER TO CREATE TASK
textRef.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') {
        const rightSectionSelectedRef = document.querySelector(".right-section .category.selected");
        const selected_category = rightSectionSelectedRef.getAttribute('data-category');
        const task = {
            id: Math.random(),
            title: e.target.value,
            category: selected_category,
        };
        addTaskinData(task);
        e.target.value = "";
        toggleModal();
        createTask(task);
    }
})

function addTaskinData(task) {
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//DISPLAYING TASK ON MAIN SCREEN
function createTask(task) {
    const taskRef = document.createElement('div');
    taskRef.className = "task";
    taskRef.setAttribute('data-id', task.id);
    taskRef.innerHTML = ` 
            <div class='task-category' data-priority=${task.category}></div>
            <div class='task-id'>${task.id}</div>
            <div class='task-title'><textarea>${task.title}</textarea></div>
            <div class='task-delete-icon'><i class="fa-solid fa-trash"></i></div>
            `;
    taskWrapperRef.appendChild(taskRef);

    //CHANGING TEXT AREA AND UPDATE IN LOCAL STORAGE
    const textareaRef = taskRef.querySelector('.task-title textarea');
    textareaRef.addEventListener('change', function (e) {
        const updatedTitle = e.target.value;
        const currentTaskId = task.id;
        updateTitleInData(currentTaskId, updatedTitle);
    })

}

//DELETE TASK FROM STORAGE
function deleteTaskFromData(taskid) {
    const idx = tasks.findIndex((task) => Number(taskid) == task.id);
    tasks.splice(idx, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//ADDING SELECTION TO THE SELECTED CHOICE(RED BORDER)
rightSectionRef.forEach(function (clickedbox) {
    selectbox(clickedbox);
})
function selectbox(clickedbox) {
    clickedbox.addEventListener('click', function (e) {
        removeSelection();
        clickedbox.classList.add('selected');
    })
}
function removeSelection() {
    rightSectionRef.forEach(function (clickedbox) {
        clickedbox.classList.remove('selected');
    })
}

//REMOVE TASKS BY CLCIKING ON TRASH ICON AND CHANGING PRIORITY
taskWrapperRef.addEventListener('click', function (e) {
    if (e.target.parentElement.className === "task-delete-icon") {
        const deleteTaskRef = e.target.closest('.task');
        const taskid = deleteTaskRef.dataset.id;
        deleteTaskRef.remove();
        deleteTaskFromData(taskid);
    }
    if (e.target.classList.contains('task-category')) {
        const currentPriority = e.target.dataset.priority;
        const nextPriority = changePriority(currentPriority);
        e.target.dataset.priority = nextPriority;
        const taskId = Number(e.target.closest('.task').dataset.id);
        updateProrityinData(taskId, nextPriority);
    }
})

//RENDERING TASK LIST AT START
function renderList(tasks) {
    tasks.forEach(task => {
        createTask(task);
    });
}

//CHANGING PRIORITY ON CLICKING
function changePriority(currentPriority) {
    const priorityList = ['p1', 'p2', 'p3', 'p4'];
    const nextPriorityidx = priorityList.findIndex((p) => p === currentPriority);
    return priorityList[(nextPriorityidx + 1) % 4];
}
//UPDATING PRIOORITY IN DOM
function updateProrityinData(taskId, nextPriority) {
    const idx = tasks.findIndex((p) => taskId === p.id);
    tasks[idx].category = nextPriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//ADDING COLOUR FILTER ACCORDING TO CHOOSE
const headerLeftRef = document.querySelector('.box1');
headerLeftRef.addEventListener('click', function (e) {
    const PriorityUse = e.target.dataset.priority;
    const TaskChildList = document.querySelectorAll('.task');
    TaskChildList.forEach(task => {
        task.classList.remove('hide');
        const currentTaskPriority = task.querySelector('.task-category');
        if (currentTaskPriority.dataset.priority != PriorityUse) {
            task.classList.add('hide');
        }
    });
})

//REMOVE BUTTON COLOUR CHANGING
removeBtnRef.addEventListener('click', function (e) {
    const deleteBtnRef = document.querySelectorAll('.task-delete-icon');
    if (removeBtnRef.classList.contains('Enabled')) {
        removeBtnRef.classList.remove('Enabled');
        taskWrapperRef.dataset.deleteEnabled = true;

    }
    else {
        removeBtnRef.classList.add('Enabled');
        taskWrapperRef.dataset.deleteEnabled = false;
    }
})

function updateTitleInData(taskId, updatedTitle) {
    const idx = tasks.findIndex((p) => Number(taskId) === p.id);
    const selectedTask = tasks[idx];
    selectedTask.title = updatedTitle;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskSearchRef.addEventListener('keyup', function (e) {
    taskWrapperRef.innerHTML = "";
    tasks.forEach((task) => {
    const SearchedText = e.target.value.toLowerCase();
    const currentTitle = task.title.toLowerCase();
        const taskID = String(task.id);
        if (SearchedText.trim() === "" || currentTitle.includes(SearchedText) || taskID.includes(SearchedText)) {
            createTask(task);
        }
    });

})