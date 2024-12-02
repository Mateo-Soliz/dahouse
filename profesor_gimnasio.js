import { Profesor } from "./profesor.js";
import { Colores } from "./enums.js";

export class ProfesorDeGimnasio extends Profesor {
    constructor(imagen, nombre, descripcion) {
        super(imagen, nombre, descripcion, Colores.GIMNASIO);
    }

    RenderizarImagen() {
        const elemento_imagen = document.createElement('img');
        elemento_imagen.style.width = "250px";
        elemento_imagen.style.height = "180px";
        elemento_imagen.src = this.imagen;
        return elemento_imagen;
    }

    RenderizarPie() {
        const pie = document.createElement('div');
        pie.classList.add('pie-tarjeta', 'gimnasio');
        pie.textContent = "Instructor de Gimnasio";
        return pie;
    }
}
