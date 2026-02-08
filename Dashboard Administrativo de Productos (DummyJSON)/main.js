let skip = 0;
const limit = 10;
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

// Función asíncrona para pedir los datos
const cargarProductos = () => {
    const buscar = document.getElementById("search-input").value;
    const criterio = document.getElementById("sort-select").value;
    const categoria = document.getElementById("category-select").value
    urlApi = `https://dummyjson.com/products`

    if (buscar) {
        urlApi += `/search?q=${buscar}&`
    } else if (categoria) {
        urlApi += `/category/${categoria}?`
    }
    else {
        urlApi += `?`
    }

    urlApi += `limit=${limit}&skip=${skip}`

    if (criterio) {
        const [campo, orden] = criterio.split("-")
        urlApi += `&sortBy=${campo}&order=${orden}`
    }
    // Usamos fetch para hacer la petición HTTP
    fetch(urlApi)
        .then(respuesta => respuesta.json())
        .then(data => {

            const productos = data.products;
            console.log("Datos recibidos:", productos);


            mostrarProductos(productos);
            document.getElementById("page-display").textContent = `Página ${(skip / limit) + 1}`;
            const btnSiguiente = document.getElementById("next-btn");

            // delimita el uso de los botones en la paginacion
            if (skip + limit >= data.total) {
                btnSiguiente.disabled = true;
                btnSiguiente.style.opacity = "0.5";
            } else {
                btnSiguiente.disabled = false;
                btnSiguiente.style.opacity = "1";
            }

            // bloquea el boton anterior si es la pagina 1
            const btnAnterior = document.getElementById("prev-btn");
            btnAnterior.disabled = (skip === 0);
            btnAnterior.style.opacity = (skip === 0) ? "0.5" : "1";
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            alert("Hubo un error al cargar los datos. Revisa la consola.");
        })


}

// Función encargada de manipular el DOM
const mostrarProductos = (productos) => {

    const contenedor = document.getElementById("table-body");


    contenedor.innerHTML = "";


    productos.forEach(producto => {

        const fila = document.createElement("tr");


        fila.innerHTML = `
        <td>${producto.id}</td>
        <td><img src="${producto.thumbnail}" class="product-img" alt="Product"></td>
        <td><strong>${producto.title}</strong></td>
        <td><span class="badge">${producto.category}</span></td>
        <td>$${producto.price}</td>
        <td>
        <button class="btn btn-edit" onclick="actualizarProductos(${producto.id}, this)">Editar</button>
        <button class="btn btn-delete" onclick="eliminarProductos(${producto.id}, this)">Borrar</button>
        </td>
        `;


        contenedor.appendChild(fila);
    })
}

const actualizarProductos = (id, boton) => {

    const nuevoTitulo = prompt("Ingrese el nuevo título del producto:");
    const nuevoprecio = prompt("Ingrese el nuevo precio del producto:");

    if (!nuevoTitulo || !nuevoprecio) {
        alert("El título o precio no pueden estar vacíos.");
        return;
    }

    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT', /* or PATCH */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: nuevoTitulo,
            price: nuevoprecio
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Producto actualizado:", data);

            const fila = boton.closest('tr');
            const celdaTitulo = fila.querySelector('strong');
            const celdaPrecio = fila.querySelector('td:nth-child(5)');
            if (celdaTitulo) {
                celdaTitulo.textContent = data.title;
            }
            if (celdaPrecio) {
                celdaPrecio.textContent = `$${data.price}`;
            }

            alert(`Éxito: Producto ${id} actualizado a "${data.title}".`);
        })
}

const eliminarProductos = (id, boton) => {
    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .then(data => {
            console.log("Producto eliminado:", data);
            alert(`Producto con ID ${data.id} eliminado correctamente.`);

            // Recargar la lista de productos después de eliminar
            const fila = boton.closest('tr').remove();
        });
}

const buscarProductos = () => {
    skip = 0;
    cargarProductos()
}

const ordenarProductos = () => {
    skip = 0
    cargarProductos()
}
const filtrarCategoria = () => {
    skip = 0
    cargarProductos()

}

const formBusqueda = document.querySelector("#search-form");

formBusqueda.addEventListener("submit", (event) => {

    event.preventDefault();

    buscarProductos();
});
document.getElementById("next-btn").addEventListener("click", () => {
    skip += limit;
    cargarProductos();
});

document.getElementById("prev-btn").addEventListener("click", () => {
    if (skip >= limit) {
        skip -= limit;
        cargarProductos();
    }
});

document.getElementById("sort-select").addEventListener("change", ordenarProductos);
document.getElementById("category-select").addEventListener("change", filtrarCategoria);
cargarProductos()