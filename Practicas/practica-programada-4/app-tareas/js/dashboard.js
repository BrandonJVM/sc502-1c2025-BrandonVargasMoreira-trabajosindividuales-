// con este script se ejecutan las peticiones al api


document.addEventListener('DOMContentLoaded', function () {// se ejecuta cunado carva el conenido con una funcion anonima
    const taskList = document.getElementById('task-list');// aca lo que se hace es que se carga la info enun lugar especifico, en este caso el elemnto con el id task_list

    fetch('api.php?action=tareas') // se llama a la accion tareas en el api que lo que hace es mostrar las tareas
        .then(res => res.json())// aca se sacan del jason 
        .then(tareas => {
            taskList.innerHTML = ''; //y se crea un espacio para almacenar las taras 

            tareas.forEach(tarea => {// se itrea el array de tareas
                const taskCard = document.createElement('div'); // se crea el html para mostrar cada tarea conlos parametros de la misma 
                taskCard.className = 'card mb-3';
                taskCard.innerHTML = `
                    <div class="card-body">
                        <h5>${tarea.title}</h5>
                        <p>${tarea.description}</p>
                        <p><small>Vence: ${tarea.dueDate}</small></p>
                        <button class="btn btn-danger btn-sm eliminar-tarea" data-id="${tarea.tarea_id}">Eliminar Tarea</button>
                        <div id="comentarios-tarea-${tarea.tarea_id}" class="comentarios mt-3"></div>
                    </div>
                `;
                taskList.appendChild(taskCard);// se agrega cada tarea 

                const botonEliminarTarea = taskCard.querySelector('.eliminar-tarea');// se agreaga el boton para eliminar la tarea con el id de la misma 
                botonEliminarTarea.addEventListener('click', function () {
                    const idTarea = this.getAttribute('data-id');// aca se referencia el id de la tarea como tal 
                    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) { // se muestra un mensaje para la confirmacion 
                        eliminarTarea(idTarea, taskCard);// se llama la funcion de eliminar tarea con el parametro del id y el card de la misma para removerlo 
                    }
                });

                const comentariosDiv = taskCard.querySelector(`#comentarios-tarea-${tarea.tarea_id}`);// se toma como parametro donde se almacenana los comentarios de las tareas 

                fetch(`api.php?action=comentarios&tarea_id=${tarea.tarea_id}`)// se solicitan los ocmentarios de la tarea con el id de la misma 
                    .then(res => res.json())// se obtiene el jason 
                    .then(comentarios => {
                        if (comentarios.length === 0) {// si no hay comentarios se muestra un texto por defecto 
                            comentariosDiv.innerHTML = '<p>No hay comentarios para esta tarea.</p>';
                        } else {// si si hay comentarios
                            comentarios.forEach((comentario, i) => {// se iteran los comentarios y se muestrasn 
                                const comentarioItem = document.createElement('div');
                                comentarioItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
                                comentarioItem.innerHTML = `
                                    <p class="mb-0">${i + 1}. ${comentario.comentario}</p>
                                    <button class="btn btn-sm btn-danger eliminar-comentario" data-id="${comentario.comentario_id}">Eliminar</button>
                                `;
                                comentariosDiv.appendChild(comentarioItem);// se agreagan al contenedor

                                const botonEliminar = comentarioItem.querySelector('.eliminar-comentario');// se agreaga el boton de eliminar y se le pasa el id del comentario 
                                botonEliminar.addEventListener('click', function () {
                                    const idComentario = this.getAttribute('data-id');// aca obtiene el id 
                                    eliminarComentario(idComentario, comentarioItem);// se llama a ala funcino de elimianr comentarios 
                                });
                            });
                        }

                        const formAgregar = document.createElement('div');// esto es para agregar un comentario 
                        formAgregar.classList.add('input-group', 'mt-2');
                        formAgregar.innerHTML = `
                            <input type="text" class="form-control nuevo-comentario" placeholder="Agregar comentario...">
                            <button class="btn btn-primary btn-agregar-comentario" type="button">Agregar</button>
                        `;
                        comentariosDiv.appendChild(formAgregar);

                        const inputComentario = formAgregar.querySelector('.nuevo-comentario');
                        const botonAgregar = formAgregar.querySelector('.btn-agregar-comentario');// se toma el texto y se le asicga una constante al boton 

                        botonAgregar.addEventListener('click', () => {// cunado se hace click 
                            const texto = inputComentario.value.trim();
                            if (!texto) return alert('Escribe un comentario');// si si hay texto se sigue si no si pide que exriban 

                            fetch(`api.php?action=agregar_comentario`, {// se llama a alaccion de agregar un coemntari o
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: `tarea_id=${tarea.tarea_id}&comentario=${encodeURIComponent(texto)}`
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        location.reload(); // o recargar solo los comentarios si prefieres
                                    } else {
                                        alert('Error al agregar comentario');
                                    }
                                })
                                .catch(err => {
                                    console.error('Error al agregar comentario:', err);
                                });
                        });
                    })
                    .catch(error => console.error('Error al obtener comentarios:', error));
            });
        });

    document.getElementById('task-form').addEventListener('submit', function (e) {// form para la creacion de tareas
        e.preventDefault();

        const title = document.getElementById('task-title').value;// se almacena la info de las tareas
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        const formData = new FormData(); // se crea ua variable donde se conctatena a info 
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dueDate', dueDate);

        fetch('api.php?action=crear_tarea', {// accion para crear un atarea 
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.mensaje) {
                    alert(data.mensaje);
                    document.getElementById('task-form').reset();// se resetea el from una vez lleno 

                    const modalElement = document.getElementById('taskModal');// se toma el form del fornt
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                    location.reload();

                } else {
                    alert(data.error || 'Ocurrió un error');
                }
            })
            .catch(error => {
                console.error('Error al crear tarea:', error);
                alert('Error en la petición');
            });
    });

    function eliminarComentario(comentarioId, elementoHTML) {// funcio de eliminar un comentario 
        fetch(`api.php?action=eliminar_comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `comentario_id=${comentarioId}`
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    elementoHTML.remove();
                }
            })
            .catch(error => {
                console.error('Error eliminando comentario:', error);
            });
    }

    function eliminarTarea(tareaId, elementoHTML) {// funcoin de eliminar una tare 
        fetch(`api.php?action=eliminar_tarea`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `tarea_id=${tareaId}`
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    elementoHTML.remove(); // Elimina la tarjeta de la tarea
                } else {
                    alert(data.error || 'Error al eliminar la tarea');
                }
            })
            .catch(error => {
                console.error('Error eliminando tarea:', error);
                alert('Error en la petición');
            });
    }
    


});


