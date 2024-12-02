function ComprobarCorreo() {
    const correo = localStorage.getItem("correo"); // Busco el correo en localStorage
  
    if (correo) {
      EnviarCarrito(correo);
    } else {
      // Si no hay correo, abro el modal de bootstrap
      const correo_modal = new bootstrap.Modal(document.getElementById("correo_modal"));
      correo_modal.show();
    }
}

function ObtenerCorreo() {
    return localStorage.getItem("correo") || null; // Devuelve el correo del localStorage o null si no existe
}

function CerrarModalEmail() {
    const correo_modal = document.getElementById("correo_modal");
    correo_modal.classList.remove('show');
    correo_modal.style.display = 'none';
    document.querySelector('.modal-backdrop').remove();
}
  
function GuardarCorreo() {
    const correo_input = document.getElementById("correo_input").value;

    if (correo_input) {
        localStorage.setItem("correo", correo_input); // Guardo el correo en localStorage

        // Cierro el modal y procedo a reservar
        CerrarModalEmail();
        EnviarCarrito(correo_input);
    } else {
        alert("Por favor, introduce un correo válido.");
}
}