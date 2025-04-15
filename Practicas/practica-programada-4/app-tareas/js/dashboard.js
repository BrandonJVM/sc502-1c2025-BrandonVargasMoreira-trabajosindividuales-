document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
console.log(taskList);  

    fetch('api.php?action=tareas').then(res => res.json()).then(tareas => {
            taskList.innerHTML = ''; 
            tareas.forEach(tarea => {
                const taskCard = document.createElement('div');
                taskCard.className = 'card mb-3';
                taskCard.innerHTML = `
                    <div class="card-body">
                        <h5>${tarea.titulo}</h5>
                        <p>${tarea.descripcion}</p>
                        <p><small>Vence: ${tarea.fecha_limite}</small></p>
                        <div id="comentarios-tarea-${tarea.id}" class="comentarios"></div>
                    </div>
                `;
                taskList.appendChild(taskCard);

                fetch(`api.php?action=comentarios&tarea_id=${tarea.id}`).then(res => res.json()).then(comentarios => {
                        const comentariosDiv = document.getElementById(`comentarios-tarea-${tarea.id}`);
                        comentarios.forEach((comentario, i) => {
                            const comentarioHTML = `<p>${i + 1}. ${comentario.comentario}</p>`;
                            comentariosDiv.innerHTML += comentarioHTML;
                        });
                    });
            });
        });

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const titulo = document.getElementById('task-title').value;
        const descripcion = document.getElementById('task-desc').value;
        const fecha_limite = document.getElementById('due-date').value;

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('fecha_limite', fecha_limite);

        fetch('api.php?action=crear_tarea', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje) {
                alert(data.mensaje);
                document.getElementById('task-form').reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
                modal.hide();
                location.reload();
            } else {
                alert(data.error || 'Ocurrió un error');
            }
        });
    });
});
