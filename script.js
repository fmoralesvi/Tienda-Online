document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".producto").forEach(function (producto) {
        let selectUnidad = producto.querySelector(".unidad");
        let inputCantidad = producto.querySelector(".cantidad");
        let precioElemento = producto.querySelector(".precio");
        let precio = precioElemento ? parseFloat(precioElemento.getAttribute("data-precio")) : 0;
        let idProducto = producto.querySelector("h3")?.textContent.toLowerCase().replace(/\s+/g, "-");
        let botonAgregar = producto.querySelector(".btn-agregar");

        if (!selectUnidad || !inputCantidad || !botonAgregar || !idProducto) return; // Evita errores

        // Cargar valores almacenados
        let unidadGuardada = localStorage.getItem(`unidad-${idProducto}`);
        let cantidadGuardada = localStorage.getItem(`cantidad-${idProducto}`);

        if (unidadGuardada) selectUnidad.value = unidadGuardada;
        if (cantidadGuardada) inputCantidad.value = cantidadGuardada;

        // Guardar cambios en localStorage
        selectUnidad.addEventListener("change", function () {
            localStorage.setItem(`unidad-${idProducto}`, this.value);
        });

        inputCantidad.addEventListener("input", function () {
            localStorage.setItem(`cantidad-${idProducto}`, this.value);
        });

        // Agregar producto al carrito
        botonAgregar.addEventListener("click", function () {
            agregarAlCarrito(idProducto, precio, `unidad-${idProducto}`, `cantidad-${idProducto}`);
        });
    });

    actualizarCarrito(); // Actualiza el carrito al cargar la página
});

// ✅ Función para agregar productos al carrito
function agregarAlCarrito(id, precio, idUnidad, idCantidad) {
    let inputCantidad = document.getElementById(idCantidad);
    let selectUnidad = document.getElementById(idUnidad);
    
    if (!inputCantidad || !selectUnidad) return;

    let cantidad = parseFloat(inputCantidad.value);
    let unidad = selectUnidad.value;

    if (cantidad > 0) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let productoExistente = carrito.find(item => item.id === id);

        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push({ id, precio, cantidad, unidad });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }
}

// ✅ Función para actualizar la pantalla del carrito
function actualizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    let totalPagar = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    let totalProductosElemento = document.getElementById("total-productos");
    let totalPagarElemento = document.getElementById("total-pagar");

    if (totalProductosElemento) totalProductosElemento.textContent = totalProductos;
    if (totalPagarElemento) totalPagarElemento.textContent = "$" + totalPagar.toLocaleString("es-CO");
}
