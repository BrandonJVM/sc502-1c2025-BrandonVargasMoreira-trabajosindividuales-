document.addEventListener('DOMContentLoaded', () => {
  const wishForm = document.getElementById('wishForm');
  const wishInput = document.getElementById('wishInput');
  const wishList = document.getElementById('wishList');

  fetchWishes();

  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = wishInput.value.trim();

    if (titulo) {
      const response = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion: '' })
      });

      const result = await response.json();
      if (result.message) {
        wishInput.value = '';
        fetchWishes();
      } else {
        alert(result.error || 'Error al agregar el deseo');
      }
    }
  });

  async function fetchWishes() {
    const response = await fetch('api.php');
    const wishes = await response.json();

    wishList.innerHTML = '';
    wishes.forEach(wish => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = wish.titulo;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.addEventListener('click', () => deleteWish(wish.id));

      li.appendChild(deleteBtn);
      wishList.appendChild(li);
    });
  }

  async function deleteWish(id) {
    const response = await fetch('api.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    const result = await response.json();
    if (result.message) {
      fetchWishes();
    } else {
      alert(result.error || 'Error al eliminar el deseo');
    }
  }
}); s