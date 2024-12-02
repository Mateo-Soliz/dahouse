// Variables
var lst_reservas = [];
var lst_dias = [];
var lst_carrito = [];
var lst_horas_bloq = [];
var lst_th_movil = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];
var sel_index_movil = 0;
var trigger_responsive = false;

function format_date(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function obtener_proxima_semana(primer_dia_semana, ultimo_dia_semana, proxima = true) {
  // Convertir las fechas de entrada a objetos Date
  let primera_fecha = new Date(primer_dia_semana);
  let ultima_fecha = new Date(ultimo_dia_semana);
  
  // Calcular los ajustes en días dependiendo de si se solicita la próxima semana o la anterior
  let ajuste_dias = proxima ? 7 : -7;

  // Calcular el primer día de la semana deseada
  let primera_fecha_deseada = new Date(primera_fecha);
  primera_fecha_deseada.setDate(primera_fecha.getDate() + ajuste_dias);
  
  // Calcular el último día de la semana deseada
  let ultima_fecha_deseada = new Date(ultima_fecha);
  ultima_fecha_deseada.setDate(ultima_fecha.getDate() + ajuste_dias);
  
  // Formatear las fechas en formato YYYY-MM-DD
  semana_actual[0] = format_date(primera_fecha_deseada);
  semana_actual[1] = format_date(ultima_fecha_deseada);
  console.log("Obtener proxima fecha:", semana_actual[0], semana_actual[1]);
  
  // Obtener las reservas y aplicar cambios a la tabla
  GetReservas(semana_actual[0], semana_actual[1]);
}

function ObtenerDiaSemana(fecha) {
  const dias_semana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  // Divido la cadena de fecha
  const partes = fecha.split('-');
  const año = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript son 0-indexados
  const dia = parseInt(partes[2], 10);

  // Creo un objeto Date usando la fecha en formato UTC
  const fechaObjeto = new Date(Date.UTC(año, mes, dia));

  // Obtengo el indice del dia de la semana
  const dia_semana = fechaObjeto.getUTCDay();

  // Devuelvo el dia de la semana
  return dias_semana[dia_semana];
}

function AplicarCambiosCalendario(reservas, h_bloqueadas) {
  let lst_td = document.querySelectorAll('td[dia][hora]');
  let dias_semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  for (let i = 0; i < lst_td.length; i++) {
    var td = lst_td[i];
    const dia = td.getAttribute('dia');
    const hora = td.getAttribute('hora');
    let dia_mes_sel = lst_dias[dias_semana.indexOf(dia)];
    let actividad = actividades_semana[dia][hora];
    console.log(dia, hora);
    if (dia === "sabado" || dia === "domingo") {
      td.innerHTML = `21€<br>${actividad}`;

    } else {
        td.innerHTML = `16€<br>${actividad}`;
    }
    td.className = "disponible";
    td.addEventListener("dblclick", DobleClickHandler);
    td.addEventListener("touchstart", ClickHandler);

    // Compruebo si esta en proceso de reserva si lo esta lo muestro en pantalla:
    for (let k=0; k<lst_carrito.length; k++) {
      dia_carrito = lst_carrito[k]["dia"];
      hora_carrito = lst_carrito[k]["hora"];

      console.log(hora_carrito)
      

      let partes = hora_carrito.split(":");
      let horas_int = parseInt(partes[0], 10);
      let h = "";
      

      // Mientras no se llegue a las 23:00
        while (horas_int <= 23) { // 22 representa las 23:00 en formato de 24 horas
          // Imprimir la hora actual
          console.log(`${horas_int}:00`);
          h = `${horas_int}:00`;

          if (dia_carrito === dia_mes_sel && h === hora && td.innerHTML !== "Reservando") {
            td.innerHTML = "Reservando";
            td.className = "comprar "+'h' + horas_int;
            // Asignas el id al elemento <td>
            // td.setAttribute('id', nuevo_id);
            td.removeEventListener("dblclick", DobleClickHandler);
    
          }
          
          //Pinta y escribe hora inicio
          if (dia_carrito === dia_mes_sel && hora_carrito === hora) {
            var nuevo_id = 'h' + horas_int;
            td.innerHTML = "Hora inicio";
            td.className = "comprar2 "+'h' + horas_int;
            // Asignas el id al elemento <td>
            // td.setAttribute('id', nuevo_id);
            td.removeEventListener("dblclick", DobleClickHandler);

          }

          //Pinta y escribe hora final
          console.log("hora_carrito: "+hora_carrito);
          if (dia_carrito === dia_mes_sel && '23:00' === hora ) {
            var nuevo_id = 'h' + horas_int;
            td.innerHTML = "Hora fin max. 00:00h";
            td.className = "comprar2 "+'h' + horas_int;
            td.removeEventListener("dblclick", DobleClickHandler);
          } 

          console.log(hora_carrito);

          if (hora_carrito === '23:00') {
            if (dia_carrito === dia_mes_sel && '23:00' === hora) {
              td.innerHTML = "Hora inicio / hora final 00:00h";
              td.className = "comprar2 "+'h' + horas_int;
              td.removeEventListener("dblclick", DobleClickHandler);
            }
          }

          // Incrementar la hora
          horas_int++;
      }
    }

    for (let j = 0; j < reservas.length; j++) {
      let reserva_dia = ObtenerDiaSemana(reservas[j].dia);
      let reserva_hora = reservas[j].hora;
      

    //  Al hacer click en reservar se reserva aquí
    let h = parseInt(reserva_hora.slice(0, 2));
    
      while (h <= 23) {
        let formattedHora = h.toString().padStart(1, '0') + ":00";
        console.log("___formattedHora: "+formattedHora);

        if (dia === reserva_dia && formattedHora === hora ) {
          td.textContent = "Reservado";
          td.className = "reservado";
          td.removeEventListener("dblclick", DobleClickHandler);
          td.removeEventListener("touchstart", ClickHandler);
          console.log("reserva_hora: "+reserva_hora);
          console.log("type: "+typeof(reserva_hora));

          AplicarInicioFinReservado(reserva_hora, reserva_dia)
        }
        h++;
      }
      
    }

    // Aplico bloqueos en pantalla
    for (let q=0; q<h_bloqueadas.length; q++) {
      dia_bloq = ObtenerDiaSemana(h_bloqueadas[q].dia);
      hora_inicio_bloq = h_bloqueadas[q]["hora_inicio"];
      hora_fin_bloq = h_bloqueadas[q]["hora_fin"];

      if (dia_bloq === dia && hora_inicio_bloq == hora && td.innerHTML !== "Bloqueado" || dia_bloq === dia && hora_fin_bloq == hora && td.innerHTML !== "Bloqueado") {
        td.removeEventListener("dblclick", DobleClickHandler);

        if (hora_inicio_bloq == hora) {
          td.setAttribute("bloqueo", "inicio");
        } else {
          td.setAttribute("bloqueo", "fin");
          AplicarBloqueosCalendario(hora_inicio_bloq, hora_fin_bloq, dia_bloq); // Aplico al td Bloqueado los td que están entre el principio y el final td bloqueados
        }
      }
    }
  }
}

function AplicarInicioFinReservado(hora_inicio, dia) {
  let hora = parseInt(hora_inicio.slice(0, 2));
  let td_rang_reserv = null;
  while (hora <= 23) {
    console.log("hora" + hora);
    let formattedHora = hora.toString().padStart(2, '0') + ":00";
    td_rang_reserv = document.querySelector(`td[dia='${dia}'][hora='${formattedHora}']`);
    if (td_rang_reserv !== null && td_rang_reserv.innerHTML !== "Bloqueado") {
      td_rang_reserv.innerHTML = "Reservado";
      
      console.log("cambiando reservado");
    }
    hora++;
  }
}

function AplicarBloqueosCalendario(hora_inicio, hora_fin, dia_semana) {
  let lst_td = document.querySelectorAll(`td[dia=${dia_semana}][hora]`);
  let area_bloqueo = false;

  for (let i = 0; i < lst_td.length; i++) {
    var td = lst_td[i];
    const hora = td.getAttribute('hora');

    if (area_bloqueo) {
      td.innerHTML = "Bloqueado";
      td.className = "bloqueado";
      td.removeEventListener("dblclick", DobleClickHandler);
    }

    if (hora == hora_inicio) {
      area_bloqueo = true;
    }

    if (hora == hora_fin) {
      area_bloqueo = false;
      break;
    }

  }
}

function GetReservas(fecha_inicio, fecha_fin) {
  var xhttp = new XMLHttpRequest();
  // url_actual = `http://${window.location.hostname}:3000/reservas/clases.php`;
  // Para que funcione con extension php server
  url_actual = `http://localhost:3000/reservas/clases.php`;
  sesión = ObtenerCorreo();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var respuesta = JSON.parse(this.responseText);
      lst_reservas = respuesta.reservas;
      lst_horas_bloq = respuesta.h_bloqueadas;
      try {
        lst_dias = ActualizarArrayDias();
      }
      catch(err) {
        console.error("Error: Hubo un error al actualizar lst_dias... "+err)
      }
      AplicarCambiosCalendario(lst_reservas, lst_horas_bloq);
      try {
        let [mes, año] = sacar_mes_año(semana_actual[0]);
        CambiarFecha(mes, año);
      }
      catch(err) {
        console.error("Error: Hubo un error al cambiar la fecha del span o sacando mes y año de la fecha... "+err)
      }
    }
  };
  
  if (sesión) { // si hay sesión mando el correo del usuario al servidor php
    xhttp.open("GET", `${url_actual}?fecha-inicio=${fecha_inicio}&fecha-fin=${fecha_fin}&email=${sesión}`, true);
  } else {
    xhttp.open("GET", `${url_actual}?fecha-inicio=${fecha_inicio}&fecha-fin=${fecha_fin}`, true);
  }
  xhttp.send();
}

function sacar_mes_año(fecha_str) {
    const partes = fecha_str.split('-');
    const año = partes[0];
    const numero_mes = parseInt(partes[1], 10);
  
    const nombres_meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  
    const mes = nombres_meses[numero_mes - 1];
    
    return [mes, año];
}

function CambiarFecha(nuevo_mes, nuevo_año) {
  let span_mes = document.getElementById("mes");
  let span_año = document.getElementById("año");
  let span_semana = document.getElementById("semana");

  span_mes.innerHTML = nuevo_mes;
  span_año.innerHTML = nuevo_año;
  span_semana.innerHTML = `Semana del ${semana_actual[0].split("-")[2]} al ${semana_actual[1].split("-")[2]} de ${nuevo_mes}`;
}

function ActualizarArrayDias() {
  let principio = new Date(semana_actual[0] + 'T20:00:00Z');
  let final = new Date(semana_actual[1] + 'T23:59:59Z');

  console.log("Actualizar dias: " + principio + " " + final);
  let dias_semana = [];

  while (principio <= final) {
    dias_semana.push(format_date(principio));
    principio.setDate(principio.getDate() + 1);
  }

  return dias_semana;
}

function ObtenerSemanaDia(dia_semana) {
  let dias_semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  return lst_dias[dias_semana.indexOf(dia_semana)];
}



function ClickReservar(elemento_td) {
  let dias_semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  let dia_semana = elemento_td.getAttribute('dia');
  let dia = ObtenerSemanaDia(dia_semana);
  let dia_mes_sel = lst_dias[dias_semana.indexOf(dia_semana)].split("-")[2];
  const hora = elemento_td.getAttribute('hora');

  // Calcular el precio de la reserva
  let precio = dia_semana === "sabado" || dia_semana === "domingo" ? 21 : 16;

  // Validar si ya existe alguna reserva para este día y hora en el carrito
  let existeReservaMismoDiaHora = lst_carrito.some(item => item.dia === dia && item.hora === hora);

  if (!existeReservaMismoDiaHora) {
    // Validar si ya existe alguna reserva para este día en el carrito
    let existeReservaMismoDia = lst_carrito.some(item => item.dia === dia);

    if (!existeReservaMismoDia) {
      // Añadir la reserva al carrito
      lst_carrito.push({ "dia": dia, "hora": hora, "precio": precio });

      // Llamar a la función para contar las reservas
      contarReservas();

      // Cambio clase css y contenido del elemento HTML
      elemento_td.className = "reservado2";
      elemento_td.innerHTML = "Hora inicio";

      // Crear un nuevo elemento <li> para la lista de reservas
      let li = document.createElement("LI");
      li.innerHTML = `${dia_semana.charAt(0).toUpperCase()}${dia_semana.slice(1)} ${dia_mes_sel} De ${hora} hasta 00:00h - ${precio}€`;

      // Generar un ID único para cada <li>
      li.id = `reserva-${dia}-${hora.replace(":", "-")}`;

      // Crear el botón de eliminar
      let btnEliminar = document.createElement("BUTTON");
      btnEliminar.innerHTML = "X";
      btnEliminar.className = "eliminar";
      btnEliminar.onclick = function() {
        // Encontrar la reserva correspondiente
        let reserva = lst_carrito.find(item => item.dia === dia && item.hora === hora);

        // Eliminar la reserva del carrito
        lst_carrito = lst_carrito.filter(item => item !== reserva);

        // Remover el <li> de la lista
        li.remove();

        // Llamar a la función para contar las reservas después de eliminar
        contarReservas();
        AplicarCambiosCalendario(lst_reservas, lst_horas_bloq);
      };

      li.appendChild(btnEliminar);
      document.getElementById("ul-reservas").appendChild(li);

      // Obtener todas las horas para este día y marcarlas como "Comprar" si son posteriores a la seleccionada
      let tdsMismoDia = document.querySelectorAll(`td[dia="${dia_semana}"]`);
      let clickedTime = parseInt(hora.split(":")[0]); // Obtener la hora seleccionada como entero
      tdsMismoDia.forEach(td => {
        let tdHora = td.getAttribute('hora');
        let tdTime = parseInt(tdHora.split(":")[0]);
        if (tdTime > clickedTime) {
          td.className = "comprar";
          if (tdTime === 23) {
            td.innerHTML = "Hora fin max. 00:00h";
            td.className = "reservado2";
          } else {
            td.innerHTML = "Reservando";
          }
        }
      });

      // Si se elige la última hora disponible
      if (parseInt(hora.split(":")[0]) === 23) {
        elemento_td.innerHTML = "Hora inicio / hora final 00:00h";
      }
    } else {
      // Si ya existe alguna reserva para este día, mostrar mensaje o alerta
      console.log("Ya hay una reserva para este día en el carrito.");
    }
  } else {
    // Si ya existe alguna reserva para esta hora, mostrar mensaje o alerta
    console.log("Ya hay una reserva para esta hora en el carrito.");
  }
}

function DobleClickHandler() {
  ClickReservar(this);
  this.removeEventListener("dblclick", DobleClickHandler);
}

function ClickHandler(event) {
  // Aquí puedes colocar el código que maneja el clic o touchstart
  let td = event.target; // Elemento td que recibió el evento

  // Ejemplo de código dentro del ClickHandler
  // console.log("Elemento clickeado:", td.textContent);

  ClickReservar(this);


  let elementoClicado = event.target;

  // Obtener las clases del elemento clicado
  let clasesElemento = elementoClicado.className;

  // Mostrar las clases por consola (o hacer lo que necesites con ellas)
  console.log("Clases del elemento clicado:", clasesElemento);
}

function VaciarCarrito() {
  let ul_reservas = document.getElementById("ul-reservas");
  let valor_reservas = document.getElementById("valor-reservas");
  ul_reservas.innerHTML = ""; // vació elemento ul
  valor_reservas.innerText = "0€"; // total a 0 eur
  lst_carrito = [];

  // Recargar la página actual
  window.location.reload();
}

function contarReservas() {
  let total_reservas = document.getElementById("valor-reservas");
  let int_total_reservas = 0;

  // Calcular el total de reservas sumando los precios de todas las reservas en lst_carrito
  lst_carrito.forEach(item => {
    int_total_reservas += item.precio;
  });

  // Actualizar el total mostrado en el HTML
  total_reservas.innerText = int_total_reservas + "€";
}

function EnviarCarrito(correo_electrónico) {
    url_comprar = `http://localhost:3000/reservas/comprar.php`;
  
    if (lst_carrito.length > 0) { 
      var xhttp = new XMLHttpRequest();
      // Respuesta POST
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
              console.log("Respuesta del servidor:", this.responseText);
              if (this.status == 200) {
                  console.log("Respuesta del servidor:", this.responseText);
                  window.location.href = `http://127.0.0.1:5500/index.html`;
              } else {
                  console.error("Error al procesar la reserva:", this.responseText);
              }
          }
      };
      xhttp.open("POST", url_comprar, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
  
      const carrito_con_email = {
          correo: correo_electrónico,
          reservas: lst_carrito
      };
      
      // Convierto a JSON el carrito completo (correo + reservas)
      xhttp.send(JSON.stringify(carrito_con_email));
    } else {
      console.error("¡No podemos enviar al servidor el carrito porque está vacío!");
    }
}

function DiaConAcento(str_dia) {
  switch (str_dia) {
      case "lunes":
        return "LUNES";
      case "martes":
        return "MARTES";
      case "miercoles":
        return "MIÉRCOLES";
      case "jueves":
        return "JUEVES";
      case "viernes":
        return "VIERNES";
      case "sabado":
        return "SÁBADO";
      default:
        return "DOMINGO";
  }
}

function mostrar_th_td_texto(lst_txt) {
  // Pongo todos los <th> en display none
  const lst_th = document.getElementsByTagName('th');
  const lst_td = document.querySelectorAll('td[hora][dia]');

  Array.from(lst_th).forEach(th => th.style.display = 'none');
  Array.from(lst_td).forEach(td => td.style.display = 'none');
  if (window.innerWidth < 450) { // solo ejecuto esto si el ancho es menor a 450px
    // Itero sobre los elementos <th>
    for (let i = 0; i < lst_th.length; i++) {
        const th = lst_th[i];
        const texto_th = th.textContent.trim().toUpperCase(); // obtengo texto

        // Verifico si el texto es el mismo
        if (lst_txt.includes(texto_th) || texto_th.includes("HORARIO")) {
            // Si es asi lo muestro
            th.removeAttribute('style')
        }
    }
    // Itero sobre los elementos <td> con parámetro dia y hora
    for (let i = 0; i < lst_td.length; i++) {
      const td = lst_td[i];
      const texto_td_dia = DiaConAcento(td.getAttribute("dia").trim()); // obtengo texto en mayúsculas y con acento
      // Verifico si el texto es el mismo
      if (lst_txt.includes(texto_td_dia)) {
          // Si es asi lo muestro
          td.removeAttribute('style')
      }
  }
  }
}

function ObtenerTresDias() {
  var tres_dias = [];
  for (let i = 0; i < 3; i++) {
    tres_dias.push(lst_th_movil[(sel_index_movil + i) % lst_th_movil.length]);
  }
  return tres_dias;
}

function SiguienteDia() {
  sel_index_movil = (sel_index_movil + 1) % lst_th_movil.length;
  if (sel_index_movil === 5) {
      sel_index_movil = 0;
  }
  var nueva_lst = ObtenerTresDias();
  mostrar_th_td_texto(nueva_lst);
}

function AnchoMovil() {
  console.log("¡Ancho menor a 450px!");
  const dias_sel = ObtenerTresDias();
  mostrar_th_td_texto(dias_sel);
}

function AnchoEscritorio() {
  console.log("¡Ancho mayor a 450px!");
  sel_index_movil = 0;
  Array.from(document.getElementsByTagName("th")).forEach(th => th.removeAttribute('style'));
  Array.from(document.querySelectorAll("td[hora][dia]")).forEach(td => td.removeAttribute('style'));
}

GetReservas(semana_actual[0], semana_actual[1]);

window.addEventListener("resize", function() {
  const ancho_actual = window.innerWidth;
  if (ancho_actual <= 450 && !trigger_responsive) {
    AnchoMovil();
    trigger_responsive = true;
  } else if (ancho_actual > 450) {
    AnchoEscritorio();
    trigger_responsive = false;
  }
});