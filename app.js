const productos = [
    {
        id: 1,
        nombre: "Televisión",
        precio: 5000,
        imagen: "imagenes/Captura de pantalla 2026-09-03 183227.png",
        categoria: "Entretenimiento",
        stock: 99
    },
    {
        id: 2,
        nombre: "Lavadora",
        precio: 8000,
        imagen: "imagenes/Captura de pantalla 2026-09-03 183928.png",
        categoria: "Línea blanca",
        stock: 99
    },
    {
        id: 3,
        nombre: "Refrigerador",
        precio: 12000,
        imagen: "imagenes/Captura de pantalla 2026-09-03 184103.png",
        categoria: "Línea blanca",
        stock: 99
    },
    {
        id: 4,
        nombre: "Aire Acondicionado",
        precio: 10000,
        imagen: "imagenes/Captura de pantalla 2026-09-03 184246.png",
        categoria: "Climatización",
        stock: 99
    },
    {
        id: 5,
        nombre: "Ventilador",
        precio: 1500,
        imagen: "imagenes/Captura de pantalla 2026-09-03 184417.png",
        categoria: "Climatización",
        stock: 99
    },
    {
        id: 6,
        nombre: "Estufa",
        precio: 7000,
        imagen: "imagenes/Captura de pantalla 2026-09-03 185648.png",
        categoria: "Cocina",
        stock: 99
    }
];


let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

let historial =
    JSON.parse(localStorage.getItem("historial")) || [];

let metodoPago = "";
let descuento = 0;
let codigoCuponAplicado = "";
let costoEnvio = 0;

let usuarios =
    JSON.parse(localStorage.getItem("usuarios")) || [];

let sesionUsuario =
    JSON.parse(localStorage.getItem("sesionUsuario")) || null;



const stockOriginal = {};

productos.forEach(producto => {

    stockOriginal[producto.id] =
        producto.stock;

});




let inventariosUsuarios =
    JSON.parse(
        localStorage.getItem(
            "inventariosUsuarios"
        )
    ) || {};

let inventario = {};



function cargarInventarioUsuario() {

    if (!sesionUsuario) {

        inventario = {
            ...stockOriginal
        };

        localStorage.setItem(
            "inventario",
            JSON.stringify(
                inventario
            )
        );

        return;
    }


    const nombreUsuario =
        sesionUsuario.usuario.toLowerCase();


    if (
        !inventariosUsuarios[nombreUsuario]
    ) {

        const claveAnterior =
            Object.keys(
                inventariosUsuarios
            ).find(
                clave =>
                    clave.toLowerCase() ===
                    nombreUsuario
            );


        if (claveAnterior) {

            inventariosUsuarios[nombreUsuario] =
                {
                    ...inventariosUsuarios[
                        claveAnterior
                    ]
                };


            delete inventariosUsuarios[
                claveAnterior
            ];


            localStorage.setItem(
                "inventariosUsuarios",
                JSON.stringify(
                    inventariosUsuarios
                )
            );

        }

    }


    if (
        !inventariosUsuarios[nombreUsuario]
    ) {

        inventariosUsuarios[nombreUsuario] = {
            ...stockOriginal
        };


        localStorage.setItem(
            "inventariosUsuarios",
            JSON.stringify(
                inventariosUsuarios
            )
        );

    }


    inventario = {
        ...inventariosUsuarios[
            nombreUsuario
        ]
    };


    localStorage.setItem(
        "inventario",
        JSON.stringify(
            inventario
        )
    );

}


function guardarInventarioUsuario() {

    if (!sesionUsuario) {

        inventario = {
            ...stockOriginal
        };


        localStorage.setItem(
            "inventario",
            JSON.stringify(
                inventario
            )
        );

        return;
    }


    const nombreUsuario =
        sesionUsuario.usuario.toLowerCase();


    inventariosUsuarios[
        nombreUsuario
    ] = {
        ...inventario
    };


    localStorage.setItem(
        "inventariosUsuarios",
        JSON.stringify(
            inventariosUsuarios
        )
    );


    localStorage.setItem(
        "inventario",
        JSON.stringify(
            inventario
        )
    );

}


cargarInventarioUsuario();




function obtenerStock(id) {

    const producto =
        productos.find(
            p => p.id == id
        );


    if (!producto) return 0;


    if (
        inventario[id] === undefined
    ) {

        inventario[id] =
            producto.stock;

    }


    return Number(
        inventario[id]
    );

}



function obtenerCantidadCarrito(id) {

    return carrito.filter(
        producto =>
            producto.id == id
    ).length;

}



function obtenerStockDisponible(id) {

    return Math.max(
        0,
        obtenerStock(id) -
        obtenerCantidadCarrito(id)
    );

}




function actualizarStockProductos() {

    document
        .querySelectorAll(".producto")
        .forEach(tarjeta => {

            const boton =
                tarjeta.querySelector(
                    ".btn-agregar"
                );


            if (!boton) return;


            const id =
                Number(
                    boton.dataset.id
                );


            const stock =
                obtenerStockDisponible(
                    id
                );


            const elementoStock =
                tarjeta.querySelector(
                    ".stock-producto"
                );


            if (elementoStock) {

                if (stock > 0) {

                    elementoStock.textContent =
                        "📦 Stock disponible: " +
                        stock;

                }

                else {

                    elementoStock.textContent =
                        "❌ Agotado";

                }

            }


            if (stock <= 0) {

                boton.disabled =
                    true;

            }

            else {

                boton.disabled =
                    false;

            }

        });

}



document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarUsuarios();

        actualizarCarrito();

        actualizarStockProductos();

        mostrarHistorial();

        configurarDrawer();

        configurarFiltros();

        configurarEnvio();

        configurarValidaciones();



        const loginBtn =
            document.getElementById(
                "loginBtn"
            );


        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        const cerrarLogin =
            document.getElementById(
                "cerrarLogin"
            );


        if (loginBtn) {

            loginBtn.onclick = () => {

                const popup =
                    document.getElementById(
                        "loginPopup"
                    );


                if (popup) {

                    popup.classList.add(
                        "visible"
                    );

                }

            };

        }


        if (logoutBtn) {

            logoutBtn.onclick = () => {

                sesionUsuario = null;


                localStorage.removeItem(
                    "sesionUsuario"
                );


                carrito = [];


                localStorage.setItem(
                    "carrito",
                    JSON.stringify(
                        carrito
                    )
                );


                cargarInventarioUsuario();

                actualizarUsuario();

                actualizarCarrito();

                actualizarStockProductos();


                alert(
                    "👋 Sesión cerrada correctamente."
                );

            };

        }


        if (cerrarLogin) {

            cerrarLogin.onclick = () => {

                const popup =
                    document.getElementById(
                        "loginPopup"
                    );


                if (popup) {

                    popup.classList.remove(
                        "visible"
                    );

                }

            };

        }


       

        const inputBusqueda =
            document.getElementById(
                "buscador"
            );


        if (inputBusqueda) {

            inputBusqueda.addEventListener(
                "input",
                () => {

                    aplicarFiltros();

                }
            );

        }


     
        document
            .querySelectorAll(
                ".btn-agregar"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        const producto =
                            productos.find(
                                p =>
                                    p.id ==
                                    btn.dataset.id
                            );


                        if (!producto)
                            return;


                        const cantidadActual =
                            obtenerCantidadCarrito(
                                producto.id
                            );


                        const stockActual =
                            obtenerStock(
                                producto.id
                            );


                        if (
                            cantidadActual >=
                            10
                        ) {

                            alert(
                                "⚠️ Solo puedes agregar máximo 10 unidades de este producto."
                            );

                            return;

                        }


                        if (
                            cantidadActual >=
                            stockActual
                        ) {

                            alert(
                                "⚠️ No hay más stock disponible de este producto."
                            );

                            return;

                        }


                        carrito.push(
                            producto
                        );


                        guardar();

                        actualizarCarrito();

                        actualizarStockProductos();


                        alert(
                            "✅ Producto agregado"
                        );

                    }
                );

            });


    

        const carritoBtn =
            document.getElementById(
                "carritoBtn"
            );


        if (carritoBtn) {

            carritoBtn.onclick = () => {

                reiniciarCheckout();

                actualizarCarrito();


                const popup =
                    document.getElementById(
                        "carritoPopup"
                    );


                if (popup) {

                    popup.classList.add(
                        "visible"
                    );

                    popup.classList.add(
                        "drawer"
                    );

                }

            };

        }


        const historialBtn =
            document.getElementById(
                "historialBtn"
            );


        if (historialBtn) {

            historialBtn.onclick = () => {

                mostrarHistorial();


                const popup =
                    document.getElementById(
                        "historialPopup"
                    );


                if (popup) {

                    popup.classList.add(
                        "visible"
                    );

                }

            };

        }



        const cerrarCarrito =
            document.getElementById(
                "cerrarCarrito"
            );


        if (cerrarCarrito) {

            cerrarCarrito.onclick = () => {

                const popup =
                    document.getElementById(
                        "carritoPopup"
                    );


                if (popup) {

                    popup.classList.remove(
                        "visible"
                    );

                }

            };

        }



        const cerrarHistorial =
            document.getElementById(
                "cerrarHistorial"
            );


        if (cerrarHistorial) {

            cerrarHistorial.onclick = () => {

                const popup =
                    document.getElementById(
                        "historialPopup"
                    );


                if (popup) {

                    popup.classList.remove(
                        "visible"
                    );

                }

            };

        }


        document
            .querySelectorAll(
                ".btn-pago"
            )
            .forEach(btn => {

                btn.onclick = () => {

                    metodoPago =
                        btn.dataset.metodo;


                    const metodoSeleccionado =
                        document.getElementById(
                            "metodoSeleccionado"
                        );


                    if (
                        metodoSeleccionado
                    ) {

                        metodoSeleccionado.value =
                            metodoPago;


                        quitarError(
                            metodoSeleccionado
                        );

                    }


                    document
                        .querySelectorAll(
                            ".datos-pago"
                        )
                        .forEach(div => {

                            div.style.display =
                                "none";

                        });


                    if (
                        metodoPago ===
                        "Tarjeta"
                    ) {

                        const datos =
                            document.getElementById(
                                "datosTarjeta"
                            );


                        if (datos) {

                            datos.style.display =
                                "block";

                        }

                    }


                    if (
                        metodoPago ===
                        "PayPal"
                    ) {

                        const datos =
                            document.getElementById(
                                "datosPayPal"
                            );


                        if (datos) {

                            datos.style.display =
                                "block";

                        }

                    }


                    if (
                        metodoPago ===
                        "MercadoPago"
                    ) {

                        const datos =
                            document.getElementById(
                                "datosMercadoPago"
                            );


                        if (datos) {

                            datos.style.display =
                                "block";

                        }

                    }

                };

            });



        const aplicarCupon =
            document.getElementById(
                "aplicarCupon"
            );


        if (aplicarCupon) {

            aplicarCupon.onclick = () => {

                const input =
                    document.getElementById(
                        "codigoCupon"
                    );


                const mensaje =
                    document.getElementById(
                        "mensajeCupon"
                    );


                const codigo =
                    input.value
                        .trim()
                        .toUpperCase();


                const subtotal =
                    carrito.reduce(
                        (suma, producto) =>
                            suma +
                            producto.precio,
                        0
                    );


                if (!codigo) {

                    mensaje.textContent =
                        "⚠️ Escribe un código de cupón.";

                    return;

                }


                if (!carrito.length) {

                    mensaje.textContent =
                        "⚠️ Agrega productos antes de aplicar un cupón.";

                    return;

                }


                if (
                    codigo ===
                    "NACHO10"
                ) {

                    descuento =
                        subtotal *
                        0.10;

                    codigoCuponAplicado =
                        codigo;


                    mensaje.textContent =
                        "✅ Cupón aplicado: 10% de descuento.";

                    mensaje.style.color =
                        "green";


                    actualizarCheckout();

                }


                else if (
                    codigo ===
                    "NACHO20"
                ) {

                    descuento =
                        subtotal *
                        0.20;

                    codigoCuponAplicado =
                        codigo;


                    mensaje.textContent =
                        "✅ Cupón aplicado: 20% de descuento.";

                    mensaje.style.color =
                        "green";


                    actualizarCheckout();

                }


                else if (
                    codigo ===
                    "PROFE100"
                ) {

                    descuento =
                        100;

                    codigoCuponAplicado =
                        codigo;


                    mensaje.textContent =
                        "🎉 Cupón PROFE100 aplicado: $100 de descuento.";

                    mensaje.style.color =
                        "green";


                    actualizarCheckout();

                }


                else {

                    descuento = 0;

                    codigoCuponAplicado =
                        "";


                    mensaje.textContent =
                        "❌ Cupón no válido.";

                    mensaje.style.color =
                        "red";


                    actualizarCheckout();

                }

            };

        }




        const confirmarCompra =
            document.getElementById(
                "confirmarCompra"
            );


        if (confirmarCompra) {

            confirmarCompra.onclick =
                comprar;

        }


        const cerrarConfirmacion =
            document.getElementById(
                "cerrarConfirmacion"
            );


        if (cerrarConfirmacion) {

            cerrarConfirmacion.onclick =
                () => {

                    const popup =
                        document.getElementById(
                            "confirmacionPopup"
                        );


                    if (popup) {

                        popup.classList.remove(
                            "visible"
                        );

                    }

                };

        }

        const botonesFavorito =
            document.querySelectorAll(
                ".btn-favorito"
            );


        botonesFavorito.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            String(
                                boton.dataset.id
                            );


                        let favoritos =
                            JSON.parse(
                                localStorage.getItem(
                                    "favoritos"
                                )
                            ) || [];


                        favoritos =
                            favoritos.map(
                                String
                            );


                        if (
                            favoritos.includes(
                                id
                            )
                        ) {

                            favoritos =
                                favoritos.filter(
                                    fav =>
                                        fav !== id
                                );


                            boton.textContent =
                                "🤍";


                            boton.classList.remove(
                                "favorito-activo"
                            );

                        }

                        else {

                            favoritos.push(
                                id
                            );


                            boton.textContent =
                                "❤️";


                            boton.classList.add(
                                "favorito-activo"
                            );

                        }


                        localStorage.setItem(
                            "favoritos",
                            JSON.stringify(
                                favoritos
                            )
                        );

                    }
                );

            });



        let favoritosGuardados =
            JSON.parse(
                localStorage.getItem(
                    "favoritos"
                )
            ) || [];


        favoritosGuardados =
            favoritosGuardados.map(
                String
            );


        botonesFavorito.forEach(
            boton => {

                const id =
                    String(
                        boton.dataset.id
                    );


                if (
                    favoritosGuardados.includes(
                        id
                    )
                ) {

                    boton.textContent =
                        "❤️";


                    boton.classList.add(
                        "favorito-activo"
                    );

                }

                else {

                    boton.textContent =
                        "🤍";

                }

            }
        );



        const favoritosBtn =
            document.getElementById(
                "favoritosBtn"
            );


        if (favoritosBtn) {

            favoritosBtn.onclick = () => {

                mostrarFavoritos();


                const popup =
                    document.getElementById(
                        "favoritosPopup"
                    );


                if (popup) {

                    popup.classList.add(
                        "visible"
                    );

                }

            };

        }


        const cerrarFavoritos =
            document.getElementById(
                "cerrarFavoritos"
            );


        if (cerrarFavoritos) {

            cerrarFavoritos.onclick =
                () => {

                    const popup =
                        document.getElementById(
                            "favoritosPopup"
                        );


                    if (popup) {

                        popup.classList.remove(
                            "visible"
                        );

                    }

                };

        }




        document
            .querySelectorAll(
                ".producto img, .producto h3"
            )
            .forEach(el => {

                el.style.cursor =
                    "pointer";


                el.addEventListener(
                    "click",
                    () => {

                        const productoDiv =
                            el.closest(
                                ".producto"
                            );


                        if (!productoDiv)
                            return;


                        const botonAgregar =
                            productoDiv.querySelector(
                                ".btn-agregar"
                            );


                        if (!botonAgregar)
                            return;


                        const id =
                            botonAgregar.dataset.id;


                        abrirQuickView(id);

                    }
                );

            });



        document
            .querySelectorAll(
                ".btn-quick-view"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        abrirQuickView(
                            btn.dataset.id
                        );

                    }
                );

            });


        /* =====================================================
           CERRAR QUICK VIEW
        ===================================================== */

        const cerrarDetalle =
            document.getElementById(
                "cerrarDetalle"
            );


        if (cerrarDetalle) {

            cerrarDetalle.onclick =
                () => {

                    const popup =
                        document.getElementById(
                            "productoPopup"
                        );


                    if (popup) {

                        popup.classList.remove(
                            "visible"
                        );

                    }

                };

        }


    

        const btnHero =
            document.querySelector(
                ".btn-hero"
            );


        if (btnHero) {

            btnHero.addEventListener(
                "click",
                e => {

                    e.preventDefault();


                    const productosSeccion =
                        document.getElementById(
                            "productos"
                        );


                    if (
                        productosSeccion
                    ) {

                        productosSeccion.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                    }

                }
            );

        }

    }
);


function guardar() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(
            carrito
        )
    );


    localStorage.setItem(
        "historial",
        JSON.stringify(
            historial
        )
    );


    guardarInventarioUsuario();

}



function configurarDrawer() {

    const popup =
        document.getElementById(
            "carritoPopup"
        );


    if (!popup) return;


    popup.style.position =
        "fixed";

    popup.style.top =
        "0";

    popup.style.right =
        "0";

    popup.style.left =
        "auto";

    popup.style.bottom =
        "0";

    popup.style.width =
        "400px";

    popup.style.maxWidth =
        "90%";

    popup.style.height =
        "100vh";

    popup.style.overflowY =
        "auto";

    popup.style.zIndex =
        "9999";

    popup.style.transform =
        "translateX(100%)";

    popup.style.transition =
        "transform 0.3s ease";


    const estilo =
        document.createElement(
            "style"
        );


    estilo.textContent = `

        #carritoPopup.drawer.visible {
            transform: translateX(0) !important;
        }

        #carritoPopup.drawer .popup-contenido {
            min-height: 100%;
        }

        .cantidad-control {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
        }

        .cantidad-control button {
            width: 30px;
            height: 30px;
            cursor: pointer;
        }

        .cantidad-control span {
            min-width: 25px;
            text-align: center;
            font-weight: bold;
        }

        .campo-error {
            border: 2px solid red !important;
        }

        .mensaje-error {
            color: red;
            font-size: 13px;
            margin: 4px 0 8px;
        }

        .campo-correcto {
            border: 2px solid green !important;
        }

        .filtros-combinados {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 15px auto;
        }

        .filtros-combinados select,
        .barra-busqueda select {
            padding: 10px;
            border-radius: 8px;
        }

        #productoPopup .popup-contenido {
            max-width: 450px;
        }

        .stock-producto {
            font-weight: bold;
            margin: 8px 0;
        }

        .btn-agregar:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .usuario-sesion {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        #nombreUsuario {
            font-weight: bold;
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .login-form input {
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }

        .login-form button {
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        #mensajeLogin {
            font-weight: bold;
        }

        .badge-oferta {
            display: inline-block;
            padding: 5px 10px;
            margin-bottom: 8px;
            border-radius: 20px;
            background: #e53935;
            color: white;
            font-weight: bold;
            font-size: 13px;
        }

        .procesando-compra {
            text-align: center;
        }

        .spinner {
            width: 55px;
            height: 55px;
            margin: 0 auto 15px;
            border: 6px solid #ddd;
            border-top: 6px solid #333;
            border-radius: 50%;
            animation: girarSpinner 1s linear infinite;
        }

        @keyframes girarSpinner {
            to {
                transform: rotate(360deg);
            }
        }

        .resumen-final {
            margin-top: 15px;
            padding: 15px;
            border-radius: 10px;
            background: #f5f5f5;
        }

        .resumen-final p {
            margin: 8px 0;
        }

    `;


    document.head.appendChild(
        estilo
    );

}


function configurarFiltros() {

    const categoria =
        document.getElementById(
            "filtroCategoria"
        );


    const precio =
        document.getElementById(
            "filtroPrecio"
        );


    const orden =
        document.getElementById(
            "ordenProductos"
        );


    if (categoria) {

        categoria.addEventListener(
            "change",
            aplicarFiltros
        );

    }


    if (precio) {

        precio.addEventListener(
            "change",
            aplicarFiltros
        );

    }


    if (orden) {

        orden.addEventListener(
            "change",
            aplicarFiltros
        );

    }

}


function aplicarFiltros() {

    const texto =
        (
            document.getElementById(
                "buscador"
            )?.value || ""
        ).toLowerCase();


    const categoria =
        document.getElementById(
            "filtroCategoria"
        )?.value ||
        "todas";


    const rangoPrecio =
        document.getElementById(
            "filtroPrecio"
        )?.value ||
        "todos";


    const orden =
        document.getElementById(
            "ordenProductos"
        )?.value ||
        "normal";


    let lista =
        [...productos];


    lista =
        lista.filter(
            producto => {

                const coincideNombre =
                    producto.nombre
                        .toLowerCase()
                        .includes(
                            texto
                        );


                const coincideCategoria =
                    categoria ===
                        "todas" ||
                    producto.categoria ===
                        categoria;


                let coincidePrecio =
                    true;


                if (
                    rangoPrecio !==
                    "todos"
                ) {

                    const partes =
                        rangoPrecio.split(
                            "-"
                        );


                    const minimo =
                        Number(
                            partes[0]
                        );


                    const maximo =
                        Number(
                            partes[1]
                        );


                    coincidePrecio =
                        producto.precio >=
                            minimo &&
                        producto.precio <=
                            maximo;

                }


                return (
                    coincideNombre &&
                    coincideCategoria &&
                    coincidePrecio
                );

            }
        );


    if (orden === "menor") {

        lista.sort(
            (a, b) =>
                a.precio -
                b.precio
        );

    }


    if (orden === "mayor") {

        lista.sort(
            (a, b) =>
                b.precio -
                a.precio
        );

    }


    if (
        orden ===
        "popularidad"
    ) {

        lista.sort(
            (a, b) =>
                obtenerPopularidad(
                    b.id
                ) -
                obtenerPopularidad(
                    a.id
                )
        );

    }


    const tarjetas =
        [
            ...document.querySelectorAll(
                ".producto"
            )
        ];


    tarjetas.forEach(
        tarjeta => {

            const boton =
                tarjeta.querySelector(
                    ".btn-agregar"
                );


            if (!boton) return;


            const id =
                Number(
                    boton.dataset.id
                );


            const mostrar =
                lista.some(
                    producto =>
                        producto.id ===
                        id
                );


            tarjeta.style.display =
                mostrar
                    ? ""
                    : "none";

        }
    );


    if (
        tarjetas.length >
        0
    ) {

        const contenedor =
            tarjetas[0]
                .parentElement;


        if (contenedor) {

            const tarjetasVisibles =
                lista
                    .map(
                        producto => {

                            return tarjetas.find(
                                tarjeta => {

                                    const boton =
                                        tarjeta.querySelector(
                                            ".btn-agregar"
                                        );


                                    return (
                                        boton &&
                                        Number(
                                            boton.dataset.id
                                        ) ===
                                            producto.id
                                    );

                                }
                            );

                        }
                    )
                    .filter(
                        Boolean
                    );


            const tarjetasOcultas =
                tarjetas.filter(
                    tarjeta => {

                        const boton =
                            tarjeta.querySelector(
                                ".btn-agregar"
                            );


                        if (!boton) {

                            return false;

                        }


                        const id =
                            Number(
                                boton.dataset.id
                            );


                        return !lista.some(
                            producto =>
                                producto.id ===
                                id
                        );

                    }
                );


            [
                ...tarjetasVisibles,
                ...tarjetasOcultas
            ].forEach(
                tarjeta => {

                    contenedor.appendChild(
                        tarjeta
                    );

                }
            );

        }

    }

}




function obtenerPopularidad(id) {

    let cantidad = 0;


    historial.forEach(
        compra => {

            if (
                !compra.productos
            )
                return;


            compra.productos.forEach(
                producto => {

                    if (
                        producto.id ===
                        id
                    ) {

                        cantidad++;

                    }

                }
            );

        }
    );


    return cantidad;

}



function abrirQuickView(id) {

    const producto =
        productos.find(
            p => p.id == id
        );


    if (!producto) return;


    const nombre =
        document.getElementById(
            "detalleNombre"
        );


    const precio =
        document.getElementById(
            "detallePrecio"
        );


    const descripcion =
        document.getElementById(
            "detalleDescripcion"
        );


    const galeria =
        document.getElementById(
            "galeriaImagenes"
        );


    const cantidad =
        document.getElementById(
            "detalleCantidad"
        );


    const stockDetalle =
        document.getElementById(
            "detalleStock"
        );


    if (nombre) {

        nombre.textContent =
            producto.nombre;

    }


    if (precio) {

        precio.textContent =
            producto.precio.toLocaleString(
                "es-MX"
            );

    }


    if (descripcion) {

        descripcion.textContent =
            "Excelente producto " +
            producto.nombre +
            " para tu hogar. Categoría: " +
            producto.categoria +
            ".";

    }


    const stockDisponible =
        obtenerStockDisponible(
            producto.id
        );


    if (stockDetalle) {

        if (
            stockDisponible >
            0
        ) {

            stockDetalle.textContent =
                "📦 Stock disponible: " +
                stockDisponible;

        }

        else {

            stockDetalle.textContent =
                "❌ Agotado";

        }

    }


    if (cantidad) {

        cantidad.value = 1;


        cantidad.max =
            Math.min(
                10,
                stockDisponible
            );


        cantidad.disabled =
            stockDisponible <=
            0;

    }


    if (galeria) {

        galeria.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

        `;

    }


    const productoPopup =
        document.getElementById(
            "productoPopup"
        );


    if (productoPopup) {

        productoPopup.classList.add(
            "visible"
        );

    }


    const agregarDetalle =
        document.getElementById(
            "agregarDetalle"
        );


    if (agregarDetalle) {

        agregarDetalle.onclick =
            () => {

                let cantidadElegida =
                    parseInt(
                        document.getElementById(
                            "detalleCantidad"
                        ).value
                    );


                if (
                    isNaN(
                        cantidadElegida
                    ) ||
                    cantidadElegida <
                        1
                ) {

                    cantidadElegida =
                        1;

                }


                const stockDisponibleActual =
                    obtenerStockDisponible(
                        producto.id
                    );


                if (
                    cantidadElegida >
                    stockDisponibleActual
                ) {

                    alert(
                        "⚠️ Solo hay " +
                        stockDisponibleActual +
                        " unidades disponibles."
                    );

                    return;

                }


                if (
                    cantidadElegida >
                    10
                ) {

                    alert(
                        "⚠️ El máximo permitido es de 10 unidades."
                    );

                    return;

                }


                const cantidadActual =
                    obtenerCantidadCarrito(
                        producto.id
                    );


                if (
                    cantidadActual +
                        cantidadElegida >
                    10
                ) {

                    alert(
                        "⚠️ No puedes tener más de 10 unidades de este producto en el carrito."
                    );

                    return;

                }


                for (
                    let i = 0;
                    i <
                    cantidadElegida;
                    i++
                ) {

                    carrito.push(
                        producto
                    );

                }


                guardar();

                actualizarCarrito();

                actualizarStockProductos();


                if (productoPopup) {

                    productoPopup.classList.remove(
                        "visible"
                    );

                }


                alert(
                    "✅ Producto agregado al carrito"
                );

            };

    }

}

function actualizarCheckout() {

    const subtotalElemento =
        document.getElementById(
            "subtotal"
        );


    const impuestoElemento =
        document.getElementById(
            "impuesto"
        );


    const envioElemento =
        document.getElementById(
            "envio"
        );


    const descuentoElemento =
        document.getElementById(
            "descuento"
        );


    const totalElemento =
        document.getElementById(
            "total"
        );


    if (
        !subtotalElemento ||
        !impuestoElemento ||
        !envioElemento ||
        !descuentoElemento ||
        !totalElemento
    ) {

        return;

    }


    const subtotal =
        carrito.reduce(
            (suma, producto) =>
                suma +
                producto.precio,
            0
        );


    const impuesto =
        subtotal *
        0.16;


    const total =
        Math.max(
            subtotal +
                impuesto +
                costoEnvio -
                descuento,
            0
        );


    subtotalElemento.textContent =
        subtotal.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    2
            }
        );


    impuestoElemento.textContent =
        impuesto.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    2
            }
        );


    envioElemento.textContent =
        costoEnvio.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    2
            }
        );


    descuentoElemento.textContent =
        descuento.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    2
            }
        );


    totalElemento.textContent =
        total.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits:
                    2
            }
        );


    return total;

}


function actualizarCarrito() {

    const lista =
        document.getElementById(
            "listaCarrito"
        );


    const contador =
        document.getElementById(
            "contador"
        );


    if (!lista) {

        return;

    }


    if (contador) {

        contador.textContent =
            carrito.length;

    }


    lista.innerHTML = "";


    if (
        carrito.length ===
        0
    ) {

        lista.innerHTML =
            "<p>🛒 Carrito vacío</p>";


        descuento = 0;

        codigoCuponAplicado =
            "";

        costoEnvio = 0;


        const codigoCupon =
            document.getElementById(
                "codigoCupon"
            );


        const mensajeCupon =
            document.getElementById(
                "mensajeCupon"
            );


        if (codigoCupon) {

            codigoCupon.value =
                "";

        }


        if (mensajeCupon) {

            mensajeCupon.textContent =
                "";

        }


        actualizarCheckout();

        actualizarStockProductos();

        return;

    }


    const productosAgrupados =
        {};


    carrito.forEach(
        producto => {

            if (
                !productosAgrupados[
                    producto.id
                ]
            ) {

                productosAgrupados[
                    producto.id
                ] = {

                    producto:
                        producto,

                    cantidad:
                        0

                };

            }


            productosAgrupados[
                producto.id
            ].cantidad++;

        }
    );


    Object.values(
        productosAgrupados
    ).forEach(
        grupo => {

            const producto =
                grupo.producto;


            const cantidad =
                grupo.cantidad;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "producto-carrito";


            div.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

                <div class="info-producto">

                    <strong>
                        ${producto.nombre}
                    </strong>

                    <p>
                        $${producto.precio.toLocaleString(
                            "es-MX"
                        )}
                    </p>

                    <p>
                        📦 Stock disponible:
                        ${obtenerStockDisponible(
                            producto.id
                        )}
                    </p>

                    <div class="cantidad-control">

                        <button
                            type="button"
                            class="btn-menos">

                            −

                        </button>

                        <span>
                            ${cantidad}
                        </span>

                        <button
                            type="button"
                            class="btn-mas">

                            +

                        </button>

                    </div>

                </div>

                <button
                    type="button"
                    class="btn-eliminar">

                    ❌

                </button>

            `;


            div.querySelector(
                ".btn-menos"
            ).onclick = () => {

                const indice =
                    carrito.findIndex(
                        p =>
                            p.id ===
                            producto.id
                    );


                if (
                    indice !==
                    -1
                ) {

                    carrito.splice(
                        indice,
                        1
                    );

                }


                guardar();

                actualizarCarrito();

                actualizarStockProductos();

            };


            div.querySelector(
                ".btn-mas"
            ).onclick = () => {

                if (
                    cantidad >=
                    10
                ) {

                    alert(
                        "⚠️ Máximo 10 unidades por producto."
                    );

                    return;

                }


                const stockActual =
                    obtenerStock(
                        producto.id
                    );


                if (
                    cantidad >=
                    stockActual
                ) {

                    alert(
                        "⚠️ No hay más stock disponible. Stock máximo: " +
                        stockActual
                    );

                    return;

                }


                carrito.push(
                    producto
                );


                guardar();

                actualizarCarrito();

                actualizarStockProductos();

            };


            div.querySelector(
                ".btn-eliminar"
            ).onclick = () => {

                carrito =
                    carrito.filter(
                        p =>
                            p.id !==
                            producto.id
                    );


                guardar();

                actualizarCarrito();

                actualizarStockProductos();

            };


            lista.appendChild(
                div
            );

        }
    );


    actualizarCheckout();

    actualizarStockProductos();

}



function configurarEnvio() {

    const boton =
        document.getElementById(
            "calcularEnvio"
        );


    if (!boton) return;


    boton.onclick = () => {

        const input =
            document.getElementById(
                "codigoPostal"
            );


        const mensaje =
            document.getElementById(
                "mensajeEnvio"
            );


        const codigo =
            input.value.trim();


        if (
            !/^\d{5}$/.test(
                codigo
            )
        ) {

            costoEnvio = 0;


            input.classList.add(
                "campo-error"
            );


            input.classList.remove(
                "campo-correcto"
            );


            mensaje.textContent =
                "❌ Escribe un código postal válido de 5 números.";


            actualizarCheckout();

            return;

        }


        input.classList.remove(
            "campo-error"
        );


        input.classList.add(
            "campo-correcto"
        );


        const primerosDigitos =
            Number(
                codigo.substring(
                    0,
                    2
                )
            );


        if (
            primerosDigitos <
            10
        ) {

            costoEnvio = 100;

        }

        else if (
            primerosDigitos <
            30
        ) {

            costoEnvio = 150;

        }

        else if (
            primerosDigitos <
            50
        ) {

            costoEnvio = 200;

        }

        else {

            costoEnvio = 250;

        }


        mensaje.textContent =
            "✅ Envío calculado correctamente.";


        actualizarCheckout();

    };

}


function configurarValidaciones() {

    const nombre =
        document.getElementById(
            "nombreCliente"
        );


    if (nombre) {

        nombre.addEventListener(
            "blur",
            () => {

                if (
                    nombre.value.trim() ===
                    ""
                ) {

                    mostrarError(
                        nombre,
                        "El nombre es obligatorio."
                    );

                }

                else {

                    quitarError(
                        nombre
                    );

                }

            }
        );

    }


    const correo =
        document.getElementById(
            "correoPayPal"
        );


    if (correo) {

        correo.addEventListener(
            "blur",
            () => {

                if (
                    correo.value.trim() ===
                    ""
                ) {

                    mostrarError(
                        correo,
                        "El correo es obligatorio."
                    );

                }

                else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        correo.value.trim()
                    )
                ) {

                    mostrarError(
                        correo,
                        "Escribe un correo válido."
                    );

                }

                else {

                    quitarError(
                        correo
                    );

                }

            }
        );

    }


    const numeroTarjeta =
        document.getElementById(
            "numeroTarjeta"
        );


    if (numeroTarjeta) {

        numeroTarjeta.addEventListener(
            "blur",
            () => {

                const numero =
                    numeroTarjeta.value.replace(
                        /\s/g,
                        ""
                    );


                if (
                    numero.length <
                    16
                ) {

                    mostrarError(
                        numeroTarjeta,
                        "La tarjeta debe tener 16 números."
                    );

                }

                else {

                    quitarError(
                        numeroTarjeta
                    );

                }

            }
        );

    }


    const caducidad =
        document.getElementById(
            "caducidad"
        );


    if (caducidad) {

        caducidad.addEventListener(
            "blur",
            () => {

                if (
                    !/^\d{2}\/\d{2}$/.test(
                        caducidad.value
                    )
                ) {

                    mostrarError(
                        caducidad,
                        "Usa el formato MM/AA."
                    );

                }

                else {

                    quitarError(
                        caducidad
                    );

                }

            }
        );

    }


    const cvv =
        document.getElementById(
            "cvv"
        );


    if (cvv) {

        cvv.addEventListener(
            "blur",
            () => {

                if (
                    !/^\d{3}$/.test(
                        cvv.value
                    )
                ) {

                    mostrarError(
                        cvv,
                        "El CVV debe tener 3 números."
                    );

                }

                else {

                    quitarError(
                        cvv
                    );

                }

            }
        );

    }

}


function mostrarError(
    elemento,
    mensaje
) {

    if (!elemento) return;


    elemento.classList.add(
        "campo-error"
    );


    elemento.classList.remove(
        "campo-correcto"
    );


    let mensajeElemento =
        elemento.nextElementSibling;


    if (
        !mensajeElemento ||
        !mensajeElemento.classList.contains(
            "mensaje-error"
        )
    ) {

        mensajeElemento =
            document.createElement(
                "p"
            );


        mensajeElemento.className =
            "mensaje-error";


        elemento.parentNode.insertBefore(
            mensajeElemento,
            elemento.nextSibling
        );

    }


    mensajeElemento.textContent =
        "⚠️ " + mensaje;

}


function quitarError(
    elemento
) {

    if (!elemento) return;


    elemento.classList.remove(
        "campo-error"
    );


    elemento.classList.add(
        "campo-correcto"
    );


    const siguiente =
        elemento.nextElementSibling;


    if (
        siguiente &&
        siguiente.classList.contains(
            "mensaje-error"
        )
    ) {

        siguiente.remove();

    }

}



function comprar() {


    if (!sesionUsuario) {

        alert(
            "🔐 Debes iniciar sesión antes de realizar una compra."
        );


        const loginPopup =
            document.getElementById(
                "loginPopup"
            );


        if (loginPopup) {

            loginPopup.classList.add(
                "visible"
            );

        }


        return;

    }


    if (!carrito.length) {

        alert(
            "🛒 El carrito está vacío"
        );

        return;

    }


    const nombreElemento =
        document.getElementById(
            "nombreCliente"
        );


    if (!nombreElemento) {

        alert(
            "❌ No se encontró el campo del nombre."
        );

        return;

    }


    const nombre =
        nombreElemento.value.trim();


    if (!nombre) {

        mostrarError(
            nombreElemento,
            "Escribe el nombre del cliente."
        );

        return;

    }


    if (!metodoPago) {

        const metodo =
            document.getElementById(
                "metodoSeleccionado"
            );


        mostrarError(
            metodo,
            "Selecciona un método de pago."
        );


        return;

    }


    const cantidadesCompra =
        {};


    carrito.forEach(
        producto => {

            if (
                !cantidadesCompra[
                    producto.id
                ]
            ) {

                cantidadesCompra[
                    producto.id
                ] = 0;

            }


            cantidadesCompra[
                producto.id
            ]++;

        }
    );


    for (
        const id in
        cantidadesCompra
    ) {

        const cantidad =
            cantidadesCompra[id];


        const stock =
            obtenerStock(id);


        if (
            cantidad >
            stock
        ) {

            const producto =
                productos.find(
                    p =>
                        p.id == id
                );


            alert(
                "❌ No hay suficiente stock de " +
                producto.nombre +
                "."
            );


            return;

        }

    }



    if (
        metodoPago ===
        "Tarjeta"
    ) {

        const numeroElemento =
            document.getElementById(
                "numeroTarjeta"
            );


        const caducidadElemento =
            document.getElementById(
                "caducidad"
            );


        const cvvElemento =
            document.getElementById(
                "cvv"
            );


        const numero =
            numeroElemento.value.trim();


        const caducidad =
            caducidadElemento.value.trim();


        const cvv =
            cvvElemento.value.trim();


        if (!numero) {

            mostrarError(
                numeroElemento,
                "Escribe el número de tarjeta."
            );

            return;

        }


        if (
            !/^\d{16}$/.test(
                numero.replace(
                    /\s/g,
                    ""
                )
            )
        ) {

            mostrarError(
                numeroElemento,
                "La tarjeta debe tener 16 números."
            );

            return;

        }


        if (!caducidad) {

            mostrarError(
                caducidadElemento,
                "Escribe la fecha de caducidad."
            );

            return;

        }


        if (
            !/^\d{2}\/\d{2}$/.test(
                caducidad
            )
        ) {

            mostrarError(
                caducidadElemento,
                "Usa el formato MM/AA."
            );

            return;

        }


        if (!cvv) {

            mostrarError(
                cvvElemento,
                "Escribe el CVV."
            );

            return;

        }


        if (
            !/^\d{3}$/.test(
                cvv
            )
        ) {

            mostrarError(
                cvvElemento,
                "El CVV debe tener 3 números."
            );

            return;

        }

    }



    if (
        metodoPago ===
        "PayPal"
    ) {

        const correoElemento =
            document.getElementById(
                "correoPayPal"
            );


        const claveElemento =
            document.getElementById(
                "clavePayPal"
            );


        const correo =
            correoElemento.value.trim();


        const clave =
            claveElemento.value.trim();


        if (!correo) {

            mostrarError(
                correoElemento,
                "Escribe tu correo."
            );

            return;

        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                correo
            )
        ) {

            mostrarError(
                correoElemento,
                "Escribe un correo válido."
            );

            return;

        }


        if (!clave) {

            mostrarError(
                claveElemento,
                "Escribe la clave."
            );

            return;

        }

    }


    if (
        metodoPago ===
        "MercadoPago"
    ) {

        const usuarioElemento =
            document.getElementById(
                "usuarioMercadoPago"
            );


        const claveElemento =
            document.getElementById(
                "claveMercadoPago"
            );


        const usuario =
            usuarioElemento.value.trim();


        const clave =
            claveElemento.value.trim();


        if (!usuario) {

            mostrarError(
                usuarioElemento,
                "Escribe el usuario."
            );

            return;

        }


        if (!clave) {

            mostrarError(
                claveElemento,
                "Escribe la clave."
            );

            return;

        }

    }


    const subtotal =
        carrito.reduce(
            (suma, p) =>
                suma +
                p.precio,
            0
        );


    const impuesto =
        subtotal *
        0.16;


    const total =
        Math.max(
            subtotal +
                impuesto +
                costoEnvio -
                descuento,
            0
        );



    const numeroOrden =
        "DN-" +
        String(
            historial.length +
            1
        ).padStart(
            4,
            "0"
        );


    const compraRealizada = {

        numero:
            historial.length +
            1,

        orden:
            numeroOrden,

        cliente:
            nombre,

        usuario:
            sesionUsuario.usuario,

        productos:
            [...carrito],

        subtotal:
            subtotal,

        impuesto:
            impuesto,

        envio:
            costoEnvio,

        descuento:
            descuento,

        cupon:
            codigoCuponAplicado,

        total:
            total,

        metodo:
            metodoPago,

        fecha:
            new Date().toLocaleDateString(
                "es-MX"
            ),

        hora:
            new Date().toLocaleTimeString(
                "es-MX"
            ),

        estado:
            "Completada"

    };


    historial.push(
        compraRealizada
    );


    Object.keys(
        cantidadesCompra
    ).forEach(
        id => {

            inventario[id] =
                Math.max(
                    0,
                    obtenerStock(id) -
                        cantidadesCompra[id]
                );

        }
    );


    guardarInventarioUsuario();




    carrito = [];

    metodoPago = "";

    descuento = 0;

    codigoCuponAplicado =
        "";

    costoEnvio = 0;


    const nombreInput =
        document.getElementById(
            "nombreCliente"
        );


    if (nombreInput) {

        nombreInput.value =
            sesionUsuario
                ? sesionUsuario.usuario
                : "";

    }


    const metodoInput =
        document.getElementById(
            "metodoSeleccionado"
        );


    if (metodoInput) {

        metodoInput.value =
            "";

    }


    const codigoCupon =
        document.getElementById(
            "codigoCupon"
        );


    if (codigoCupon) {

        codigoCupon.value =
            "";

    }


    const mensajeCupon =
        document.getElementById(
            "mensajeCupon"
        );


    if (mensajeCupon) {

        mensajeCupon.textContent =
            "";

    }


    const codigoPostal =
        document.getElementById(
            "codigoPostal"
        );


    if (codigoPostal) {

        codigoPostal.value =
            "";


        codigoPostal.classList.remove(
            "campo-correcto",
            "campo-error"
        );

    }


    const mensajeEnvio =
        document.getElementById(
            "mensajeEnvio"
        );


    if (mensajeEnvio) {

        mensajeEnvio.textContent =
            "";

    }


    document
        .querySelectorAll(
            ".datos-pago"
        )
        .forEach(
            div => {

                div.style.display =
                    "none";

            }
        );


   

    guardar();

    actualizarCarrito();

    actualizarStockProductos();

    mostrarHistorial();



    const carritoPopup =
        document.getElementById(
            "carritoPopup"
        );


    if (carritoPopup) {

        carritoPopup.classList.remove(
            "visible"
        );

    }


  

    mostrarProcesandoCompra();

    setTimeout(
        () => {

            ocultarProcesandoCompra();


            const numeroOrdenElemento =
                document.getElementById(
                    "numeroOrden"
                );


            if (
                numeroOrdenElemento
            ) {

                numeroOrdenElemento.textContent =
                    numeroOrden;

            }


            agregarResumenConfirmacion(
                compraRealizada
            );


            const confirmacionPopup =
                document.getElementById(
                    "confirmacionPopup"
                );


            if (
                confirmacionPopup
            ) {

                confirmacionPopup.classList.add(
                    "visible"
                );

            }

        },
        1500
    );

}


function mostrarHistorial() {

    const lista =
        document.getElementById(
            "listaHistorial"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    if (
        historial.length ===
        0
    ) {

        lista.innerHTML =
            "<p>📋 No hay compras todavía.</p>";

        return;

    }


    historial
        .slice()
        .reverse()
        .forEach(
            compra => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "compra-historial";


                const numeroOrden =
                    compra.orden ||
                    "DN-" +
                    String(
                        compra.numero
                    ).padStart(
                        4,
                        "0"
                    );


                const subtotal =
                    compra.subtotal ??
                    compra.total;


                const impuesto =
                    compra.impuesto ??
                    0;


                const envio =
                    compra.envio ??
                    0;


                const descuentoCompra =
                    compra.descuento ??
                    0;


                const productosCompra =
                    Array.isArray(
                        compra.productos
                    )
                        ? compra.productos
                        : [];


                div.innerHTML = `

                    <div class="encabezado-compra">

                        <h3>
                            🧾 Compra #${compra.numero}
                        </h3>

                        <span>
                            ${compra.estado}
                        </span>

                    </div>

                    <p>
                        🔢
                        <strong>Orden:</strong>
                        ${numeroOrden}
                    </p>

                    <p>
                        👤
                        <strong>Cliente:</strong>
                        ${compra.cliente}
                    </p>

                    <p>
                        📅 ${compra.fecha}
                        |
                        🕐 ${compra.hora}
                    </p>

                    <p>
                        💳
                        <strong>Método:</strong>
                        ${compra.metodo}
                    </p>

                    ${productosCompra
                        .map(
                            producto => `

                            <div class="producto-historial">

                                <img
                                    src="${producto.imagen}"
                                    alt="${producto.nombre}"
                                >

                                <div>

                                    <strong>
                                        ${producto.nombre}
                                    </strong>

                                    <p>
                                        $${producto.precio.toLocaleString(
                                            "es-MX"
                                        )}
                                    </p>

                                </div>

                            </div>

                        `
                        )
                        .join("")
                    }

                    <div class="resumen-historial">

                        <p>
                            Subtotal:
                            $${subtotal.toLocaleString(
                                "es-MX",
                                {
                                    minimumFractionDigits:
                                        2
                                }
                            )}
                        </p>

                        <p>
                            Impuesto:
                            $${impuesto.toLocaleString(
                                "es-MX",
                                {
                                    minimumFractionDigits:
                                        2
                                }
                            )}
                        </p>

                        <p>
                            Envío:
                            $${envio.toLocaleString(
                                "es-MX",
                                {
                                    minimumFractionDigits:
                                        2
                                }
                            )}
                        </p>

                        <p>
                            Descuento:
                            -$${descuentoCompra.toLocaleString(
                                "es-MX",
                                {
                                    minimumFractionDigits:
                                        2
                                }
                            )}
                        </p>

                        ${
                            compra.cupon
                                ? `

                                    <p>
                                        🎟️ Cupón:
                                        ${compra.cupon}
                                    </p>

                                `
                                : ""
                        }

                        <h3>
                            💰 Total:
                            $${compra.total.toLocaleString(
                                "es-MX",
                                {
                                    minimumFractionDigits:
                                        2
                                }
                            )}
                        </h3>

                    </div>

                    <hr>

                `;


                lista.appendChild(
                    div
                );

            }
        );

}


function mostrarFavoritos() {

    const lista =
        document.getElementById(
            "listaFavoritos"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "favoritos"
            )
        ) || [];


    favoritos =
        favoritos.map(
            String
        );


    if (
        !favoritos.length
    ) {

        lista.innerHTML =
            "<p>🤍 No tienes favoritos aún.</p>";

        return;

    }


    favoritos.forEach(
        id => {

            const producto =
                productos.find(
                    p =>
                        p.id == id
                );


            if (producto) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "producto-favorito";


                div.innerHTML = `

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                    <strong>
                        ${producto.nombre}
                    </strong>

                    <p>
                        $${producto.precio.toLocaleString(
                            "es-MX"
                        )}
                    </p>

                `;


                lista.appendChild(
                    div
                );

            }

        }
    );

}



function configurarUsuarios() {

    actualizarUsuario();


    const iniciarSesion =
        document.getElementById(
            "iniciarSesion"
        );


    if (iniciarSesion) {

        iniciarSesion.onclick =
            () => {

                const usuarioInput =
                    document.getElementById(
                        "usuarioLogin"
                    );


                const claveInput =
                    document.getElementById(
                        "claveLogin"
                    );


                const mensaje =
                    document.getElementById(
                        "mensajeLogin"
                    );


                const usuario =
                    usuarioInput.value.trim();


                const clave =
                    claveInput.value.trim();


                if (
                    !usuario ||
                    !clave
                ) {

                    mensaje.textContent =
                        "⚠️ Completa usuario y contraseña.";

                    return;

                }


                const encontrado =
                    usuarios.find(
                        u =>
                            u.usuario
                                .toLowerCase() ===
                            usuario.toLowerCase() &&
                            u.clave ===
                                clave
                    );


                if (!encontrado) {

                    mensaje.textContent =
                        "❌ Usuario o contraseña incorrectos.";

                    return;

                }


                sesionUsuario = {

                    usuario:
                        encontrado.usuario

                };


                localStorage.setItem(
                    "sesionUsuario",
                    JSON.stringify(
                        sesionUsuario
                    )
                );


                cargarInventarioUsuario();

                actualizarUsuario();

                actualizarStockProductos();


                mensaje.textContent =
                    "✅ Inicio de sesión correcto.";


                usuarioInput.value =
                    "";

                claveInput.value =
                    "";


                setTimeout(
                    () => {

                        const popup =
                            document.getElementById(
                                "loginPopup"
                            );


                        if (popup) {

                            popup.classList.remove(
                                "visible"
                            );

                        }


                        mensaje.textContent =
                            "";

                    },
                    700
                );

            };

    }


    const registrarUsuario =
        document.getElementById(
            "registrarUsuario"
        );


    if (registrarUsuario) {

        registrarUsuario.onclick =
            () => {

                const usuarioInput =
                    document.getElementById(
                        "usuarioRegistro"
                    );


                const claveInput =
                    document.getElementById(
                        "claveRegistro"
                    );


                const mensaje =
                    document.getElementById(
                        "mensajeLogin"
                    );


                const usuario =
                    usuarioInput.value.trim();


                const clave =
                    claveInput.value.trim();


                if (
                    !usuario ||
                    !clave
                ) {

                    mensaje.textContent =
                        "⚠️ Completa todos los campos.";

                    return;

                }


                if (
                    usuario.length <
                    3
                ) {

                    mensaje.textContent =
                        "⚠️ El usuario debe tener al menos 3 caracteres.";

                    return;

                }


                if (
                    clave.length <
                    4
                ) {

                    mensaje.textContent =
                        "⚠️ La contraseña debe tener al menos 4 caracteres.";

                    return;

                }


                const existe =
                    usuarios.some(
                        u =>
                            u.usuario
                                .toLowerCase() ===
                            usuario.toLowerCase()
                    );


                if (existe) {

                    mensaje.textContent =
                        "❌ Ese usuario ya existe.";

                    return;

                }


                usuarios.push({

                    usuario:
                        usuario,

                    clave:
                        clave

                });


                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(
                        usuarios
                    )
                );


                inventariosUsuarios[
                    usuario.toLowerCase()
                ] = {
                    ...stockOriginal
                };


                localStorage.setItem(
                    "inventariosUsuarios",
                    JSON.stringify(
                        inventariosUsuarios
                    )
                );


                mensaje.textContent =
                    "✅ Cuenta creada correctamente.";


                usuarioInput.value =
                    "";

                claveInput.value =
                    "";

            };

    }

}



function actualizarUsuario() {

    const nombreUsuario =
        document.getElementById(
            "nombreUsuario"
        );


    const loginBtn =
        document.getElementById(
            "loginBtn"
        );


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    const nombreCliente =
        document.getElementById(
            "nombreCliente"
        );


    if (sesionUsuario) {

        cargarInventarioUsuario();


        if (nombreUsuario) {

            nombreUsuario.textContent =
                "👤 Hola, " +
                sesionUsuario.usuario;

        }


        if (loginBtn) {

            loginBtn.style.display =
                "none";

        }


        if (logoutBtn) {

            logoutBtn.style.display =
                "inline-block";

        }


        if (nombreCliente) {

            nombreCliente.value =
                sesionUsuario.usuario;


            quitarError(
                nombreCliente
            );

        }


        actualizarStockProductos();

    }

    else {

        cargarInventarioUsuario();


        if (nombreUsuario) {

            nombreUsuario.textContent =
                "👤 Invitado";

        }


        if (loginBtn) {

            loginBtn.style.display =
                "inline-block";

        }


        if (logoutBtn) {

            logoutBtn.style.display =
                "none";

        }


        if (nombreCliente) {

            nombreCliente.value =
                "";

        }


        actualizarStockProductos();

    }

}


function mostrarOfertas() {

    const productosOferta = [1, 5];


    document
        .querySelectorAll(
            ".producto"
        )
        .forEach(
            tarjeta => {

                const boton =
                    tarjeta.querySelector(
                        ".btn-agregar"
                    );


                if (!boton) return;


                const id =
                    Number(
                        boton.dataset.id
                    );


                if (
                    productosOferta.includes(
                        id
                    )
                ) {

                    if (
                        !tarjeta.querySelector(
                            ".badge-oferta"
                        )
                    ) {

                        const badge =
                            document.createElement(
                                "span"
                            );


                        badge.className =
                            "badge-oferta";


                        badge.textContent =
                            "20% OFF";


                        tarjeta.insertBefore(
                            badge,
                            tarjeta.firstElementChild
                        );

                    }

                }

            }
        );

}



let pasoCheckout = 1;


function configurarCheckoutPasos() {

    const btnPaso2 =
        document.getElementById(
            "btnPaso2"
        );


    const btnPaso3 =
        document.getElementById(
            "btnPaso3"
        );


   

    if (
        btnPaso2 &&
        !btnPaso2.dataset.configurado
    ) {

        btnPaso2.dataset.configurado =
            "true";


        btnPaso2.onclick = () => {

            const codigoPostal =
                document.getElementById(
                    "codigoPostal"
                );


            if (
                !codigoPostal ||
                !/^\d{5}$/.test(
                    codigoPostal.value.trim()
                )
            ) {

                alert(
                    "⚠️ Primero calcula un código postal válido."
                );


                return;

            }


            pasoCheckout = 2;


            actualizarPasoCheckout();

        };

    }



    if (
        btnPaso3 &&
        !btnPaso3.dataset.configurado
    ) {

        btnPaso3.dataset.configurado =
            "true";


        btnPaso3.onclick = () => {

            if (!carrito.length) {

                alert(
                    "🛒 El carrito está vacío."
                );


                return;

            }


            pasoCheckout = 3;


            actualizarPasoCheckout();

        };

    }


    actualizarPasoCheckout();

}


function actualizarPasoCheckout() {

    const envio =
        document.querySelector(
            ".calculadora-envio"
        );


    const resumen =
        document.querySelector(
            ".resumen-compra"
        );


    const cupon =
        document.querySelector(
            ".cupon"
        );


    const metodos =
        document.querySelector(
            ".metodos-pago"
        );


    const formPago =
        document.querySelector(
            ".form-pago"
        );


    const confirmar =
        document.getElementById(
            "confirmarCompra"
        );


    if (
        !envio ||
        !resumen ||
        !cupon ||
        !metodos ||
        !formPago ||
        !confirmar
    ) {

        return;

    }



    envio.style.display =
        "none";


    resumen.style.display =
        "none";


    cupon.style.display =
        "none";


    metodos.style.display =
        "none";


    formPago.style.display =
        "none";


    confirmar.style.display =
        "none";



    if (
        pasoCheckout ===
        1
    ) {

        envio.style.display =
            "block";

    }



    if (
        pasoCheckout ===
        2
    ) {

        resumen.style.display =
            "block";


        cupon.style.display =
            "block";

    }


 

    if (
        pasoCheckout ===
        3
    ) {

        metodos.style.display =
            "block";


        formPago.style.display =
            "block";


        confirmar.style.display =
            "block";

    }


    document
        .querySelectorAll(
            ".checkout-paso"
        )
        .forEach(
            paso => {

                const numero =
                    Number(
                        paso.dataset.paso
                    );


                paso.classList.remove(
                    "activo",
                    "completado"
                );


                if (
                    numero ===
                    pasoCheckout
                ) {

                    paso.classList.add(
                        "activo"
                    );

                }


                if (
                    numero <
                    pasoCheckout
                ) {

                    paso.classList.add(
                        "completado"
                    );

                }

            }
        );

}



function agregarCuponProfe100() {

    /*
       PROFE100 ya se encuentra integrado
       en el evento principal de cupones.

       Esta función se conserva para no
       eliminar funciones anteriores.
    */

    return;

}

function mostrarProcesandoCompra() {

    let popup =
        document.getElementById(
            "procesandoPopup"
        );


    if (!popup) {

        popup =
            document.createElement(
                "div"
            );


        popup.id =
            "procesandoPopup";


        popup.className =
            "popup";


        popup.innerHTML = `

            <div class="popup-contenido procesando-compra">

                <div class="spinner"></div>

                <h2>
                    ⏳ Procesando compra...
                </h2>

                <p>
                    Estamos preparando tu pedido.
                </p>

            </div>

        `;


        document.body.appendChild(
            popup
        );

    }


    popup.classList.add(
        "visible"
    );

}


function ocultarProcesandoCompra() {

    const popup =
        document.getElementById(
            "procesandoPopup"
        );


    if (popup) {

        popup.classList.remove(
            "visible"
        );

    }

}



function agregarResumenConfirmacion(
    orden
) {

    const popup =
        document.getElementById(
            "confirmacionPopup"
        );


    if (!popup || !orden) {

        return;

    }


    let resumen =
        document.getElementById(
            "resumenConfirmacion"
        );


    if (!resumen) {

        resumen =
            document.createElement(
                "div"
            );


        resumen.id =
            "resumenConfirmacion";


        const numeroOrden =
            document.getElementById(
                "numeroOrden"
            );


        if (numeroOrden) {

            numeroOrden.insertAdjacentElement(
                "afterend",
                resumen
            );

        }

    }


    resumen.innerHTML = `

        <div class="resumen-final">

            <h3>
                🧾 Resumen de compra
            </h3>

            <p>
                👤 Cliente:
                ${orden.cliente || "Cliente"}
            </p>

            <p>
                💳 Método:
                ${orden.metodo || "No especificado"}
            </p>

            <p>
                💰 Total:
                $${Number(
                    orden.total || 0
                ).toLocaleString(
                    "es-MX",
                    {
                        minimumFractionDigits:
                            2
                    }
                )}
            </p>

            <p>
                📦 Productos:
                ${
                    Array.isArray(
                        orden.productos
                    )
                        ? orden.productos.length
                        : 0
                }
            </p>

        </div>

    `;

}


function reiniciarCheckout() {

    pasoCheckout = 1;


    actualizarPasoCheckout();

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarOfertas();

        configurarCheckoutPasos();

        agregarCuponProfe100();

    }
);