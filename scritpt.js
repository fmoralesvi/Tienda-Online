document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".producto").forEach(function (producto) {
        let selectUnidad = producto.querySelector(".unidad");
        let inputCantidad = producto.querySelector(".cantidad");
        let precio = parseFloat(producto.querySelector(".precio").textContent.replace("$", ""));
        let idProducto = producto.querySelector("h3").textContent.toLowerCase().replace(" ", "-");
        let botonAgregar = producto.querySelector(".agregar-carrito");
        
        // Cargar valores almacenados si existen
        let unidadGuardada = localStorage.getItem(`unidad-${idProducto}`);
        let cantidadGuardada = localStorage.getItem(`cantidad-${idProducto}`);

        if (unidadGuardada) {
            selectUnidad.value = unidadGuardada;
        }

        if (cantidadGuardada) {
            inputCantidad.value = cantidadGuardada;
        }

        // Guardar cambios en localStorage
        selectUnidad.addEventListener("change", function () {
            localStorage.setItem(`unidad-${idProducto}`, this.value);
        });

        inputCantidad.addEventListener("input", function () {
            localStorage.setItem(`cantidad-${idProducto}`, this.value);
        });

        // Agregar producto al carrito
        botonAgregar.addEventListener("click", function () {
            agregarAlCarrito(idProducto, precio, inputCantidad.value, selectUnidad.value);
        });
    });
    
    function agregarAlCarrito(id, precio, cantidad, unidad) {
        if (cantidad > 0) {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            let productoExistente = carrito.find(item => item.id === id);

            if (productoExistente) {
                productoExistente.cantidad = parseFloat(productoExistente.cantidad) + parseFloat(cantidad);
            } else {
                carrito.push({ id, precio, cantidad, unidad });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        }
    }
    
    function actualizarCarrito() {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let totalProductos = carrito.reduce((sum, item) => sum + parseFloat(item.cantidad), 0);
        let totalPagar = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * parseFloat(item.cantidad)), 0);
        
        document.getElementById("total-productos").textContent = totalProductos;
        document.getElementById("total-pagar").textContent = "$" + totalPagar.toFixed(2);
    }
    
    actualizarCarrito();
});
