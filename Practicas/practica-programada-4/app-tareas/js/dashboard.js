document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');

    // Cargar tareas al cargar la página
    fetch('api.php?action=tareas')
        .then(res => res.json())
        .then(tareas => {
            taskList.innerHTML = ''; // Limpiar

            tareas.forEach(tarea => {
                const taskCard = document.createElement('div');
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
                taskList.appendChild(taskCard);

                const botonEliminarTarea = taskCard.querySelector('.eliminar-tarea');
                botonEliminarTarea.addEventListener('click', function () {
                    const idTarea = this.getAttribute('data-id');
                    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                        eliminarTarea(idTarea, taskCard);
                    }
                });

                const comentariosDiv = taskCard.querySelector(`#comentarios-tarea-${tarea.tarea_id}`);

                // Cargar comentarios existentes
                fetch(`api.php?action=comentarios&tarea_id=${tarea.tarea_id}`)
                    .then(res => res.json())
                    .then(comentarios => {
                        if (comentarios.length === 0) {
                            comentariosDiv.innerHTML = '<p>No hay comentarios para esta tarea.</p>';
                        } else {
                            comentarios.forEach((comentario, i) => {
                                const comentarioItem = document.createElement('div');
                                comentarioItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
                                comentarioItem.innerHTML = `
                                    <p class="mb-0">${i + 1}. ${comentario.comentario}</p>
                                    <button class="btn btn-sm btn-danger eliminar-comentario" data-id="${comentario.comentario_id}">Eliminar</button>
                                `;
                                comentariosDiv.appendChild(comentarioItem);

                                const botonEliminar = comentarioItem.querySelector('.eliminar-comentario');
                                botonEliminar.addEventListener('click', function () {
                                    const idComentario = this.getAttribute('data-id');
                                    eliminarComentario(idComentario, comentarioItem);
                                });
                            });
                        }

                        // Agregar formulario de nuevo comentario
                        const formAgregar = document.createElement('div');
                        formAgregar.classList.add('input-group', 'mt-2');
                        formAgregar.innerHTML = `
                            <input type="text" class="form-control nuevo-comentario" placeholder="Agregar comentario...">
                            <button class="btn btn-primary btn-agregar-comentario" type="button">Agregar</button>
                        `;
                        comentariosDiv.appendChild(formAgregar);

                        const inputComentario = formAgregar.querySelector('.nuevo-comentario');
                        const botonAgregar = formAgregar.querySelector('.btn-agregar-comentario');

                        botonAgregar.addEventListener('click', () => {
                            const texto = inputComentario.value.trim();
                            if (!texto) return alert('Escribe un comentario');

                            fetch(`api.php?action=agregar_comentario`, {
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

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dueDate', dueDate);

        fetch('api.php?action=crear_tarea', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.mensaje) {
                    alert(data.mensaje);
                    document.getElementById('task-form').reset();

                    const modalElement = document.getElementById('taskModal');
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

    function eliminarComentario(comentarioId, elementoHTML) {
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

    function eliminarTarea(tareaId, elementoHTML) {
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


