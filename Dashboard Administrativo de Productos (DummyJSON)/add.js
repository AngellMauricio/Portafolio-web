const categorySelect = document.getElementById('category-select')

fetch('https://dummyjson.com/products/category-list')
    .then(res => res.json())
    .then(categories => {
        categories.forEach(category => {
            const option = document.createElement('option')
            option.value = category
            option.textContent = category
            categorySelect.appendChild(option)
        });
    });



const agregarProducto = () => {
    //declarar variables

    const titulo = document.getElementById("titulo").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const descripcion = document.getElementById("descripcion").value;
    const categoria = document.getElementById("category-select").value;
    const Resultado = document.getElementById("mensaje-exito");

    //validamos que los campos no esten vacios

    if (!titulo || !precio || !descripcion) {
        alert("Por favor complete todos los campos requeridos.");
        return;

    }

    const producto = {
        title: titulo,
        price: precio,
        category: categoria,
        description: descripcion,
        thumbnail: 'https://dummyjson.com/image/400x200/008080/ffffff?text=' + titulo


    };

    //hacemos la peticion

    fetch('https://dummyjson.com/products/add', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
        .then(res => res.json())
        .then(data => {

            console.log("respuesta del api:", data);
            Resultado.style.display = "block";
            Resultado.innerHTML = `
        <strong>producto agregado correctamente!</strong><br>
        Id asignado:${data.id}<br>
        Nombre     :${data.title}<br>
        Precio     :${data.price}<br>
        
        `
        })
}
