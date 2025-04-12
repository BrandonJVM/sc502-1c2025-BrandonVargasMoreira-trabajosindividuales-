
1. Convertir index a php
index.html → index.php

2. Creda DB
CREATE DATABASE wishlist_db;

USE wishlist_db;

CREATE TABLE wishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

3. Crear archivo api.php para las peticiones e implementar metodos
    a. loadWishes (get)
    b. add (post)
    c. remove (delete)

4. Ajusta la logica del archivo js para que interactue con el api.php


