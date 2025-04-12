<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <title>Lista de Deseos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

  <div class="container py-5">
    <h 1 class="mb-4 text-center">🎁 Mi Lista de Deseos</h1>

      <!-- Formulario -->
      <form id="wishForm" class="row g-3">
        <div class="col-md-10">
          <input type="text" id="wishInput" class="form-control" placeholder="Escribe tu deseo..." required>
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-primary w-100">Agregar</button>
        </div>
      </form>

      <!-- Lista de deseos -->
      <ul id="wishList" class="list-group mt-4">
        <!-- Los deseos se agregarán aquí -->
      </ul>
  </div>

  <script src="deseos.js"></script>
</body>

</html>