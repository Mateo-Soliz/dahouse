export class Profesor {
    constructor(imagen, nombre, descripcion, area) {
        if (this.constructor === Profesor) {
            throw new Error("No se puede instanciar una clase abstracta");
        }
        this.imagen = imagen;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.area = area;
    }

    Renderizar() {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        tarjeta.appendChild(this.RenderizarImagen());
        tarjeta.appendChild(this.RenderizarCabecera());
        tarjeta.appendChild(this.RenderizarCuerpo());
        tarjeta.appendChild(this.RenderizarPie());

        return tarjeta;
    }

    RenderizarImagen() {
        throw new Error("El método RenderizarImagen debe ser implementado");
    }

    RenderizarCabecera() {
        const cabecera = document.createElement('div');
        cabecera.classList.add('cabecera-tarjeta');
        const nombre_elemento = document.createElement('h3');
        nombre_elemento.textContent = this.nombre;
        cabecera.appendChild(nombre_elemento);
        return cabecera;
    }

    RenderizarCuerpo() {
        const cuerpo = document.createElement('div');
        cuerpo.classList.add('cuerpo-tarjeta');
        const descripcion_elemento = document.createElement('p');
        descripcion_elemento.textContent = this.descripcion;
        cuerpo.appendChild(descripcion_elemento);
        return cuerpo;
    }

    // Método abstracto que deben implementar las clases hijas
    RenderizarPie() {
        throw new Error("El método RenderizarPie debe ser implementado");
    }
}

