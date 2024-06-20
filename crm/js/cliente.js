var g_id_cliente ="";

function agregarCliente(){

var id_cliente = document.getElementById("txt_id_cliente").value;
var dv        = document.getElementById("txt_dv").value;
var nombres   = document.getElementById("txt_nombres").value;
var apellidos = document.getElementById("txt_apellidos").value;
var email     = document.getElementById("txt_email").value;
var celular   = parseInt(document.getElementById("txt_celular").value);

// Valida que los campos requeridos no estén vacíos
if (!id_cliente || !dv || !nombres || !apellidos || !email || !celular) {
  mostrarAlerta('Todos los campos son obligatorios.', 'danger');
  return;
}

//Encabezado de la solicitud
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

//Carga útil de datos
const raw = JSON.stringify({
  "id_cliente": id_cliente,
  "dv": dv,
  "nombres": nombres,
  "apellidos": apellidos,
  "email": email,
  "celular": celular,
  "fecha_registro": fechaHoraActual
});

//Opciones de solicitud
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

// Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
.then((response) => {
    if (response.status === 200) {
        mostrarModal('Cliente agregado exitosamente.', 'success');
        setTimeout(() => {
            location.href = "listar.html";
        }, 2000);
    } else {
        return response.text().then((text) => { throw new Error(text); });
    }
})
.then((result) => console.log(result))
.catch((error) => {
    console.error("Error:", error);
    mostrarModal('Error al agregar el cliente: ' + error.message, 'danger');
});
}

function mostrarModal(mensaje, tipo) {
const modalBody = document.getElementById('modal-body');
modalBody.textContent = mensaje;

const myModal = new bootstrap.Modal(document.getElementById('myModal'));
myModal.show();
}

function listarCliente(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_cliente').DataTable();
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarFila(element,index,arr){

  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML +=
`<tr>
<td>${element.id_cliente}</td>
<td>${element.dv}</td>
<td>${element.nombres}</td>
<td>${element.apellidos}</td>
<td>${element.email}</td>
<td>${element.celular}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_cliente = parametros.get('id');
  g_id_cliente = p_id_cliente;
  obtenerDatosActualizar(p_id_cliente);

}
function obtenerIdEliminar(){
  //obtener datos de la solicitud
  const queryString  = window.location.search;
  //obtenemos todos los parámetros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parámetro y obtenemos su valor actual
  const p_id_cliente = parametros.get('id');
  g_id_cliente = p_id_cliente;
  obtenerDatosEliminar(p_id_cliente);

}
function obtenerDatosEliminar(p_id_cliente){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_cliente){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombre_cliente = element.nombres;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el cliente? <b>" + nombre_cliente + "</b>";
}

function completarFormulario(element,index,arr){
    document.getElementById('txt_nombres').value = nombres;
    var apellidos = element.apellidos;
    document.getElementById('txt_apellidos').value = apellidos;
    var email  = element.email;
    document.getElementById('txt_email').value = email;
    var celular   = element.celular;
    document.getElementById('txt_celular').value = celular;
}

function actualizarCliente(){
  //Obtenemos el tipo de gestión que ingresa el usuario
  var nombres   = document.getElementById("txt_nombres").value;
  var apellidos = document.getElementById("txt_apellidos").value;
  var email     = document.getElementById("txt_email").value;
  var celular   = parseInt(document.getElementById("txt_celular").value);

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //Carga útil de datos
  const raw = JSON.stringify({
    "nombres": nombres,
    "apellidos": apellidos,
    "email": email,
    "celular": celular,
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/cliente/"+ g_id_cliente, requestOptions)
    .then((response) => {
      if(response.status == 200){
        location.href ="listar.html";
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }
  function eliminarCliente(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    //Opciones de solicitud
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    //Ejecutamos solicitud
    fetch("http://144.126.210.74:8080/api/cliente/"+ g_id_cliente, requestOptions)
      .then((response) => {
        
        //Cambiar por elementos de bootstrap
        if(response.status == 200){
          location.href ="listar.html";
        }
        if(response.status == 400){
          alert("No es posible eliminar. Registro está siendo utilizado.");
        }
      })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    }

    function obtenerFechaHora(){
      var fechaHoraActual = new Date();
      var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
        hour12 :false,
        year :'numeric',
        month :'2-digit',
        day:'2-digit',
        hour : '2-digit',
        minute :'2-digit',
        second : '2-digit'
      }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
      return fechaHoraFormateada;
    }
    function formatearFechaHora(fecha_registro){
      var fechaHoraActual = new Date(fecha_registro);
      var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
        hour12 :false,
        year :'numeric',
        month :'2-digit',
        day:'2-digit',
        hour : '2-digit',
        minute :'2-digit',
        second : '2-digit',
        timeZone:'UTC'
      }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
      return fechaHoraFormateada;
    }