document.getElementById("calcular").addEventListener("click", function() {

    let edad = document.getElementById("edad").value;

    if(edad >= 18){
    document.getElementById("mensaje").innerHTML = "Eres mayor de edad";
    }else {
        document.getElementById("mensaje").innerHTML = "Eres menor de edad";

    }

});