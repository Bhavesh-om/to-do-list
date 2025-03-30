

// Date/Time 
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
}


document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});


function renderTasks() {

    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div>
                <span><i class="fas fa-tag"></i> [${task.category}]</span>
                ${task.text}
            </div>
            <div>
                <button onclick="toggleTask(${task.id})">
                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </li>
    `).join('');
}

function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = categories.map(cat => `
        <div class="category-item">
            <i class="fas fa-folder"></i> ${cat}
            ${!['Work', 'Personal', 'Shopping', 'Study'].includes(cat) ?
            `<button onclick="deleteCategory('${cat}')"><i class="fas fa-times"></i></button>` : ''
        }
        </div>
    `).join('');
}

// Initialize data from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Work', 'Personal', 'Shopping', 'Study'];

document.addEventListener('DOMContentLoaded', () => {
    updateCategoryOptions();
    renderCategories();
    renderTasks();
});

// Task functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const category = document.getElementById('categorySelect').value;

    if (!taskInput.value.trim()) {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        category: category,
        completed: false
    };

    tasks.push(task);
    saveData();
    renderTasks();
    taskInput.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveData();
    renderTasks();
}

// Category functions
function addCategory() {
    const newCategoryInput = document.getElementById('newCategory');
    const category = newCategoryInput.value.trim();

    if (!category) {
        alert('Please enter a category name!');
        return;
    }

    if (categories.includes(category)) {
        alert('Category already exists!');
        return;
    }

    categories.push(category);
    saveData();
    updateCategoryOptions();
    renderCategories();
    newCategoryInput.value = '';
}

function deleteCategory(category) {
    if (['Work', 'Personal', 'Shopping', 'Study'].includes(category)) {
        alert('Default categories cannot be deleted!');
        return;
    }

    categories = categories.filter(cat => cat !== category);
    saveData();
    updateCategoryOptions();
    renderCategories();
    renderTasks();
}

// Render functions
function renderTasks() {
    const filter = document.getElementById('filterSelect').value;
    const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.category === filter);

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div>
                <span>[${task.category}]</span>
                ${task.text}
            </div>
            <div>
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </li>
    `).join('');
}

function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = categories.map(cat => `
        <div class="category-item">
            ${cat}
            ${!['Work', 'Personal', 'Shopping', 'Study'].includes(cat) ?
            `<button onclick="deleteCategory('${cat}')">×</button>` : ''
        }
        </div>
    `).join('');
}

// Utility functions
function updateCategoryOptions() {
    const categorySelect = document.getElementById('categorySelect');
    const filterSelect = document.getElementById('filterSelect');

    categorySelect.innerHTML = categories.map(cat =>
        `<option value="${cat}">${cat}</option>`
    ).join('');

    filterSelect.innerHTML = `<option value="All">All</option>` +
        categories.map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join('');
}

function filterTasks() {
    renderTasks();
}

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('categories', JSON.stringify(categories));
}