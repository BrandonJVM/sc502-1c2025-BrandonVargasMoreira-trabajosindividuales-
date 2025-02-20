document.getElementById("calcular").addEventListener("click", function() {
    let salarioBruto = parseFloat(document.getElementById("salario").value);

    if (isNaN(salarioBruto) || salarioBruto <= 0) {
        alert("Por favor, ingrese un salario válido.");
        return;
    }

    let cargasSociales = salarioBruto * 0.105;

    let impuestoRenta = 0;

    if (salarioBruto > 4745000) {
        impuestoRenta += (salarioBruto - 4745000) * 0.25;
        salarioBruto = 4745000;
    }
    if (salarioBruto > 2373000) {
        impuestoRenta += (salarioBruto - 2373000) * 0.20;
        salarioBruto = 2373000;
    }
    if (salarioBruto > 1352000) {
        impuestoRenta += (salarioBruto - 1352000) * 0.15;
        salarioBruto = 1352000;
    }
    if (salarioBruto > 922000) {
        impuestoRenta += (salarioBruto - 922000) * 0.10;
    }

    let salarioNeto = parseFloat(document.getElementById("salario").value) - cargasSociales - impuestoRenta;

    document.getElementById("cargasSociales").textContent = `₡${cargasSociales.toFixed(2)}`;
    document.getElementById("impuestoRenta").textContent = `₡${impuestoRenta.toFixed(2)}`;
    document.getElementById("salarioNeto").textContent = `₡${salarioNeto.toFixed(2)}`;
});
