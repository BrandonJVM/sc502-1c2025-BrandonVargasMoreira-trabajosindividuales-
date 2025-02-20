const estudiantes = [
    { nombre: "Juan", apellido: "Pérez", nota: 85 },
    { nombre: "María", apellido: "Gómez", nota: 92 },
    { nombre: "Carlos", apellido: "Ramírez", nota: 78 },
    { nombre: "Ana", apellido: "Fernández", nota: 95 },
    { nombre: "Luis", apellido: "Rodríguez", nota: 88 },
    { nombre: "Brandon", apellido: "Vargas", nota: 100 },
    { nombre: "Carla", apellido: "Mora", nota: 65 },
    { nombre: "Alejandra", apellido: "Araya", nota: 25 },
    { nombre: "Manuel", apellido: "Vilchez", nota: 67 }
];

const listaDiv = document.getElementById("listaEstudiantes");

let sumaNotas = 0;

estudiantes.forEach(estudiante => {
    let estudianteParrafo = document.createElement("p"); 
    estudianteParrafo.textContent = `${estudiante.nombre} ${estudiante.apellido} - Nota: ${estudiante.nota}`;
    listaDiv.appendChild(estudianteParrafo);
    sumaNotas += estudiante.nota;
});

let promedio = sumaNotas / estudiantes.length;

let promedioParrafo = document.createElement("p"); 
promedioParrafo.classList.add("promedio");
promedioParrafo.textContent = `Promedio de notas: ${promedio.toFixed(2)}`;

listaDiv.appendChild(promedioParrafo);
