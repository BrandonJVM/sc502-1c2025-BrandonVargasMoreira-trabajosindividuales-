document.addEventListener('DOMContentLoaded', function(){

    const tasks = [{
        id: 1,
        title: "Complete project report",
        description: "Prepare and submit the project report",
        dueDate: "2024-12-01",
        comments: ["comentario 1", "comentario 2", "comentario 3"] // se crean varios comentarios quemados para que se despliegue 
    },
    {
        id:2,
        title: "Team Meeting",
        description: "Get ready for the season",
        dueDate: "2024-12-01",
        comments: ["comentario 1", "comentario 2"]
    },
    {
        id: 3,
        title: "Code Review",
        description: "Check partners code",
        dueDate: "2024-12-01",
        comments: ["comentario 1", "comentario 2"]
    }];
    
    function loadTasks(){
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function(task){// se itera cada tarea 
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            let comentarios = '';// se crea una variable para almacenar los comentarios
            let numeroDeComentario = 0;//se inicializa un contador para los comentarios esto es para mostrar el indice del comentario 
            for (let comment of task.comments) { // se iteran los comentarios de cada tarea
                numeroDeComentario++;// se incrementa el contador  en +1 
                comentarios += `<div class="comment">
                        <p class="card-text">${numeroDeComentario}. ${comment}</p>
                        <!-- se crea un boton por el cual se podera elimnar cada comentario--> 
                        <button class="btn btn-outline-danger btn-sm eliminarComentario" data-task-id="${task.id}" data-comment-index="${numeroDeComentario - 1}"> <!--se le resta uno al contador para que el indice sea correcto ya que no se muestra desde 0 para que el ususario final entienda -->
                        Eliminar comentario</button>    
                    </div> <!-- aca lo que se hace es que se crea un div para cada comentario para de esta manera poder mostrarlo 
                    y a su vez poder agregar un boton para eliminar el mismo --> 
                `; 
            }
            
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <div class="comentarios">${comentarios}</div> <!-- se muestra la variable de comentarios -->
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small> </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button type="button" class="btn btn-outline-danger delete-task" data-id="${task.id}">Delete</button>
                    <button class="btn btn-dark btn-sm add-comment" data-id="${task.id}">Añadir comentario</button> <!-- se agrega un boton para añadir comentarios -->
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(function(button){
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function(button){
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function(button){
            button.addEventListener('click', handleAddComment);
        });
        document.querySelectorAll('.eliminarComentario').forEach(function(button){
            button.addEventListener('click', handleDeleteComment);
        });
    }

    function handleEditTask(event){
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            // Cargar datos en cada campo del formulario
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.dueDate;

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        }
    }

    function handleDeleteTask(event){
        const taskId = parseInt(event.target.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        // Eliminar la tarea del array y recargarlas
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            loadTasks(); 
        }
    }

    function handleAddComment(event){
        const taskId = parseInt(event.target.dataset.id);/*se obtiene el id de la tarea */
        const comment = prompt("Ingrese su comentario");/*se solicita un comentario */

        if (comment) { /*si se ingreso un comentario  osea true*/
            const task = tasks.find(taskSelected => taskSelected.id === taskId); /*se busca la tarea con el id */
            if (task) {/*si se encontro la tarea */
                task.comments.push(comment); /*se agrega el comentario al array de comentarios */
                loadTasks(); /*se recargan las tareas */
            }
        }
    }

    function handleDeleteComment(event){// se crea la funcion para eliminar comentarios
        const taskId = parseInt(event.target.dataset.taskId);// se optiene el id de la tarea
        const commentIndex = parseInt(event.target.dataset.commentIndex);// se optiene el id del comentario segun su index 

        const task = tasks.find(taskSelected => taskSelected.id === taskId);//se busca la tarea y se carga comO "objeto"
        if (task) {// si hay tarea
            task.comments.splice(commentIndex, 1); // se elimina el comentaio con el splice
            loadTasks(); //se recargan las tareas 
        }
    }

    document.getElementById('task-form').addEventListener('submit', function(e){
        e.preventDefault();

        let currentTaskId = document.getElementById('task-id').value;
        const taskTitle = document.getElementById('task-title').value;
        const taskDesc = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        if (currentTaskId) {
            // Editar tarea existente
            const taskIndex = tasks.findIndex(t => t.id === parseInt(currentTaskId));
            tasks[taskIndex] = {
                id: parseInt(currentTaskId),
                title: taskTitle,
                description: taskDesc,
                dueDate: dueDate,
                comments: tasks[taskIndex].comments // Mantener los comentarios existentes
            };
        } else {
            // Agregar la tarea al array
            const newTask = {
                id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                title: taskTitle,
                description: taskDesc,
                dueDate: dueDate,
                comments: [] /* al momento de crear el objeto se inicializa el array de comentarios vacio */
            };
            tasks.push(newTask);// se agrega la tarea al array de tareas creado al puro inicio 
        }

        document.getElementById('task-id').value = '';
        currentTaskId = null;
        e.target.reset();

        // Recargar las tareas
        loadTasks();

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
    });

    loadTasks();

});