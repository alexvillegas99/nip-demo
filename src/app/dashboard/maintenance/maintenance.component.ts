import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent {



  screen1 = true;
  screen2 = false;
  screen3 = false;
  mantenimientoSeleccionado: any;
  cambiarPantalla(screen: any) {
    if (screen === 1) {
      this.screen1 = true;
      this.screen2 = false;
      this.screen3 = false;
    } else if (screen === 2) {
      this.screen1 = false;
      this.screen2 = true;
      this.screen3 = false;
    } else if (screen === 3) {
      this.screen1 = false;
      this.screen2 = false;
      this.screen3 = true;
    }
  }
  arrayReportes = [
    {
      name: 'Mantenimiento general',

      image:
        'https://e7.pngegg.com/pngimages/34/313/png-clipart-industry-computer-icons-project-business-technology-industry-icon-miscellaneous-angle-thumbnail.png',
    },
    {
      name: 'Mantenimiento de controladores',

      image:
        'https://e7.pngegg.com/pngimages/282/824/png-clipart-industry-industrial-control-system-computer-icons-technology-electronics-rectangle-thumbnail.png',
    },
    {
      name: 'Mantenimiento de sensores',

      image: 'https://cdn-icons-png.freepik.com/512/9708/9708985.png',
    },

    {
      name: 'Mantenimiento de alarmas',
      image:
        'https://images.vexels.com/media/users/3/149788/isolated/preview/392ae9cfa4b776ec2eac86fe92f7f3a6-ilustracion-de-luz-de-alarma-de-bombero.png?width=710',
    },
  ];

  mantenimientos = [  { 
    id: 1,
    nombre: "Cambio de filtro de aire",
    detalle: "Filtro #12",
    funcion: "Mejorar la calidad del aire aspirado por el compresor",
    detallesAdicionales: {
      descripcion: "El cambio de filtro de aire es una tarea fundamental para el mantenimiento adecuado del compresor. Este filtro es responsable de atrapar partículas de polvo y suciedad presentes en el aire, evitando que ingresen al sistema del compresor y causen daños en los componentes internos. Es importante realizar este cambio periódicamente según las recomendaciones del fabricante.",
      pasos: [
        "Localizar la ubicación del filtro de aire en el compresor.",
        "Retirar el filtro antiguo con cuidado para evitar que la suciedad caiga dentro del compartimento.",
        "Colocar el nuevo filtro en su lugar asegurándose de que esté correctamente encajado.",
        "Cerrar el compartimento del filtro y verificar que esté bien sellado."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 2,
    nombre: "Lubricación de rodamientos",
    detalle: "Rodamientos de compresor",
    funcion: "Reducir la fricción y el desgaste, aumentando la vida útil del compresor",
    detallesAdicionales: {
      descripcion: "La lubricación de los rodamientos es esencial para reducir la fricción y el desgaste de los componentes móviles del compresor, como los rotores y ejes. Esto ayuda a prolongar la vida útil del compresor y mantener su eficiencia operativa. Es importante utilizar el lubricante adecuado y seguir las recomendaciones del fabricante para el mantenimiento periódico.",
      pasos: [
        "Localizar los rodamientos en el compresor.",
        "Limpiar cualquier residuo o suciedad presente en la zona de los rodamientos.",
        "Aplicar el lubricante recomendado en la cantidad adecuada a los rodamientos.",
        "Verificar que la lubricación sea uniforme y que no haya exceso de lubricante."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 3,
    nombre: "Revisión de conexiones eléctricas",
    detalle: "Conexiones internas y externas del compresor",
    funcion: "Prevenir cortocircuitos y problemas eléctricos",
    detallesAdicionales: {
      descripcion: "La revisión de las conexiones eléctricas del compresor es esencial para garantizar su correcto funcionamiento y seguridad. Las conexiones deben estar firmemente ajustadas y libres de corrosión o daños. Se debe prestar especial atención a los puntos de conexión de alta corriente para evitar sobrecalentamientos y cortocircuitos.",
      pasos: [
        "Inspeccionar visualmente todas las conexiones eléctricas en busca de signos de desgaste, corrosión o daño.",
        "Apriete cualquier conexión suelta o corroída utilizando las herramientas adecuadas.",
        "Verificar la integridad de los cables y reparar o reemplazar los que estén dañados.",
        "Probar el sistema eléctrico del compresor para asegurarse de que todas las conexiones estén funcionando correctamente."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 4,
    nombre: "Ajuste de presión de trabajo",
    detalle: "Válvula de presión",
    funcion: "Optimizar el rendimiento del compresor de acuerdo a las necesidades de operación",
    detallesAdicionales: {
      descripcion: "El ajuste de la presión de trabajo en la válvula de presión es crucial para garantizar que el compresor funcione de manera eficiente y segura. Una presión de trabajo incorrecta puede provocar un rendimiento inadecuado del compresor, así como daños en los componentes. Es importante seguir las especificaciones del fabricante y ajustar la presión según las necesidades operativas.",
      pasos: [
        "Localizar la válvula de presión en el compresor.",
        "Utilizar un manómetro para medir la presión actual de trabajo.",
        "Ajustar la válvula de presión según las especificaciones del fabricante o las necesidades operativas.",
        "Verificar la presión nuevamente después del ajuste para asegurarse de que esté dentro de los límites aceptables."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 5,
    nombre: "Inspección de mangueras y conductos",
    detalle: "Mangueras y conductos de aire",
    funcion: "Detectar y prevenir fugas de aire que puedan afectar el rendimiento del compresor",
    detallesAdicionales: {
      descripcion: "La inspección regular de las mangueras y conductos de aire es esencial para mantener la integridad del sistema de aire del compresor. Las fugas de aire pueden reducir la eficiencia del compresor y provocar un rendimiento deficiente. Es importante revisar todas las mangueras y conductos en busca de grietas, abolladuras o conexiones sueltas, y reparar o reemplazar cualquier componente dañado.",
      pasos: [
        "Inspeccionar visualmente todas las mangueras y conductos en busca de signos de daño o desgaste.",
        "Apriete cualquier conexión suelta utilizando las herramientas adecuadas.",
        "Utilizar un detector de fugas para identificar cualquier fuga de aire.",
        "Reparar o reemplazar cualquier manguera o conducto dañado según sea necesario."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 6,
    nombre: "Cambio de aceite",
    detalle: "Aceite lubricante del compresor",
    funcion: "Mantener la lubricación adecuada de los componentes móviles del compresor",
    detallesAdicionales: {
      descripcion: "El cambio de aceite es una parte importante del mantenimiento preventivo del compresor. El aceite lubricante es crucial para reducir la fricción entre los componentes móviles, como los rotores y los cojinetes, y evitar el desgaste prematuro. Es importante utilizar el tipo de aceite correcto y cambiarlo según las especificaciones del fabricante para garantizar un rendimiento óptimo del compresor.",
      pasos: [
        "Drenar el aceite usado del compresor utilizando el método adecuado.",
        "Reemplazar el filtro de aceite si es necesario.",
        "Agregar el aceite lubricante nuevo según las especificaciones del fabricante.",
        "Verificar el nivel de aceite y ajustarlo si es necesario."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 7,
    nombre: "Limpieza de serpentín de enfriamiento",
    detalle: "Serpentín de enfriamiento del compresor",
    funcion: "Eliminar acumulaciones de suciedad que puedan reducir la eficiencia del enfriamiento",
    detallesAdicionales: {
      descripcion: "La limpieza periódica del serpentín de enfriamiento es esencial para mantener la eficiencia del sistema de refrigeración del compresor. Con el tiempo, el serpentín puede acumular suciedad, polvo y otros contaminantes que obstruyen el flujo de aire y reducen la capacidad de enfriamiento. Es importante limpiar el serpentín regularmente para garantizar un rendimiento óptimo del compresor.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder al serpentín de enfriamiento según las instrucciones del fabricante.",
        "Utilizar un cepillo suave y un limpiador suave para eliminar la suciedad y los residuos del serpentín.",
        "Enjuagar el serpentín con agua limpia para eliminar cualquier residuo restante.",
        "Permitir que el serpentín se seque completamente antes de volver a encender el compresor."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 8,
    nombre: "Reemplazo de válvula de seguridad",
    detalle: "Válvula de seguridad del compresor",
    funcion: "Garantizar la seguridad operativa al proteger el compresor de sobrepresiones",
    detallesAdicionales: {
      descripcion: "La válvula de seguridad es un componente crítico del compresor que protege contra sobrepresiones peligrosas en el sistema. Es esencial que la válvula esté en buen estado de funcionamiento y se reemplace según las recomendaciones del fabricante para garantizar la seguridad operativa del compresor. Se debe prestar especial atención a la calibración y la capacidad de alivio de presión de la válvula.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Localizar la válvula de seguridad en el compresor.",
        "Retirar la válvula antigua y limpiar la superficie de montaje.",
        "Instalar la nueva válvula de seguridad y asegurarse de que esté correctamente sellada.",
        "Probar la válvula de seguridad para asegurarse de que funcione correctamente."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 9,
    nombre: "Calibración de sensores",
    detalle: "Sensores de temperatura y presión",
    funcion: "Asegurar mediciones precisas para un funcionamiento óptimo del compresor",
    detallesAdicionales: {
      descripcion: "La calibración regular de los sensores de temperatura y presión es esencial para garantizar mediciones precisas y un funcionamiento óptimo del compresor. Los sensores descalibrados pueden conducir a lecturas incorrectas y a un rendimiento inadecuado del compresor. Es importante seguir las instrucciones del fabricante y utilizar equipos de calibración adecuados para realizar la calibración de manera precisa y confiable.",
      pasos: [
        "Acceder a los sensores de temperatura y presión en el compresor.",
        "Utilizar equipos de calibración adecuados para ajustar los valores de los sensores según las especificaciones del fabricante.",
        "Verificar las lecturas de los sensores después de la calibración para asegurarse de que sean precisas.",
        "Registrar los resultados de la calibración y mantener un registro de mantenimiento adecuado."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 10,
    nombre: "Verificación de nivel de refrigerante",
    detalle: "Sistema de refrigeración del compresor",
    funcion: "Mantener niveles adecuados de refrigerante para un funcionamiento eficiente",
    detallesAdicionales: {
      descripcion: "La verificación regular del nivel de refrigerante es esencial para garantizar un funcionamiento eficiente del compresor y prevenir problemas relacionados con el sobrecalentamiento. Un nivel de refrigerante incorrecto puede provocar un rendimiento deficiente del compresor y daños en los componentes. Es importante verificar y ajustar el nivel de refrigerante según las especificaciones del fabricante.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder al sistema de refrigeración del compresor según las instrucciones del fabricante.",
        "Verificar el nivel de refrigerante utilizando un medidor adecuado.",
        "Añadir refrigerante según sea necesario para alcanzar el nivel óptimo.",
        "Verificar el funcionamiento del compresor después de ajustar el nivel de refrigerante."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 11,
    nombre: "Reemplazo de juntas de compresor",
    detalle: "Juntas de sellado del compresor",
    funcion: "Evitar fugas de aire y mantener la hermeticidad del sistema",
    detallesAdicionales: {
      descripcion: "El reemplazo de las juntas de compresor es fundamental para prevenir fugas de aire y garantizar la hermeticidad del sistema. Las juntas desgastadas o dañadas pueden permitir la fuga de aire, lo que reduce la eficiencia del compresor y puede provocar un mal funcionamiento. Es importante inspeccionar regularmente las juntas y reemplazarlas según sea necesario.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder a las juntas de sellado del compresor según las instrucciones del fabricante.",
        "Retirar las juntas antiguas con cuidado para evitar daños en las superficies de montaje.",
        "Instalar las nuevas juntas de sellado asegurándose de que estén correctamente colocadas y selladas.",
        "Verificar la hermeticidad del sistema y realizar pruebas de funcionamiento después del reemplazo."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 12,
    nombre: "Inspección de filtros de aire",
    detalle: "Filtros de aire del compresor",
    funcion: "Eliminar obstrucciones y garantizar un flujo de aire adecuado",
    detallesAdicionales: {
      descripcion: "La inspección regular de los filtros de aire es esencial para garantizar un flujo de aire adecuado y prevenir obstrucciones que puedan afectar el rendimiento del compresor. Los filtros obstruidos pueden reducir la eficiencia del compresor y provocar un sobrecalentamiento. Es importante inspeccionar y limpiar o reemplazar los filtros según sea necesario.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder a los filtros de aire del compresor según las instrucciones del fabricante.",
        "Inspeccionar visualmente los filtros en busca de acumulaciones de suciedad, polvo o residuos.",
        "Limpiar los filtros obstruidos utilizando aire comprimido o agua a baja presión.",
        "Reemplazar los filtros si están muy sucios o dañados.",
        "Volver a colocar los filtros en su lugar y asegurarse de que estén correctamente sellados."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 13,
    nombre: "Revisión de sistema de enfriamiento",
    detalle: "Sistema de enfriamiento del compresor",
    funcion: "Prevenir el sobrecalentamiento y garantizar el funcionamiento eficiente",
    detallesAdicionales: {
      descripcion: "La revisión del sistema de enfriamiento del compresor es crucial para prevenir el sobrecalentamiento y garantizar un funcionamiento eficiente. Un sistema de enfriamiento defectuoso puede provocar daños en los componentes y una disminución del rendimiento del compresor. Es importante verificar regularmente el sistema de enfriamiento y reparar o reemplazar cualquier componente defectuoso.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Inspeccionar visualmente todas las partes del sistema de enfriamiento en busca de fugas, obstrucciones o daños.",
        "Limpiar cualquier suciedad, polvo o residuos presentes en el sistema de enfriamiento.",
        "Verificar el estado de las mangueras, conexiones y componentes del sistema.",
        "Reparar o reemplazar cualquier componente defectuoso o dañado.",
        "Volver a encender el compresor y realizar pruebas de funcionamiento del sistema de enfriamiento."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 14,
    nombre: "Revisión de sistema de lubricación",
    detalle: "Sistema de lubricación del compresor",
    funcion: "Garantizar una lubricación adecuada de los componentes móviles",
    detallesAdicionales: {
      descripcion: "La revisión del sistema de lubricación del compresor es esencial para garantizar una lubricación adecuada de los componentes móviles. La falta de lubricación puede provocar un desgaste prematuro y un mal funcionamiento del compresor. Es importante verificar regularmente el nivel de aceite y la calidad de la lubricación, así como realizar cambios de aceite según sea necesario.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Verificar el nivel de aceite en el cárter del compresor utilizando la varilla de medición.",
        "Inspeccionar visualmente el aceite para detectar signos de contaminación o dilución.",
        "Revisar los componentes del sistema de lubricación en busca de fugas, obstrucciones o daños.",
        "Realizar cambios de aceite según las recomendaciones del fabricante.",
        "Volver a encender el compresor y verificar el funcionamiento del sistema de lubricación."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 15,
    nombre: "Verificación de tensiones de correa",
    detalle: "Correas de transmisión del compresor",
    funcion: "Mantener una transmisión eficiente y prevenir daños en los componentes",
    detallesAdicionales: {
      descripcion: "La verificación regular de las tensiones de las correas de transmisión es importante para garantizar una transmisión eficiente de potencia y prevenir daños en los componentes del compresor. Las correas flojas pueden resbalar o causar desgaste prematuro, mientras que las correas demasiado tensas pueden ejercer presión excesiva sobre los rodamientos y otros componentes. Es importante verificar y ajustar las tensiones de las correas según las especificaciones del fabricante.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder a las correas de transmisión del compresor según las instrucciones del fabricante.",
        "Utilizar un medidor de tensión para verificar la tensión de las correas.",
        "Ajustar la tensión de las correas según las especificaciones del fabricante.",
        "Inspeccionar visualmente las correas en busca de signos de desgaste o daño y reemplazarlas si es necesario.",
        "Volver a encender el compresor y verificar el funcionamiento de las correas."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 16,
    nombre: "Limpieza de filtros de agua",
    detalle: "Filtros de agua del compresor",
    funcion: "Eliminar impurezas y garantizar un suministro de aire limpio",
    detallesAdicionales: {
      descripcion: "La limpieza regular de los filtros de agua es esencial para garantizar un suministro de aire limpio y prevenir la acumulación de impurezas en el compresor. Los filtros obstruidos pueden reducir el flujo de aire y provocar un mal funcionamiento del compresor. Es importante limpiar o reemplazar los filtros de agua según sea necesario para mantener la calidad del aire comprimido.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder a los filtros de agua del compresor según las instrucciones del fabricante.",
        "Retirar los filtros de agua y limpiarlos con agua limpia y detergente suave.",
        "Enjuagar los filtros completamente y dejar que se sequen al aire.",
        "Reemplazar los filtros si están muy sucios o dañados.",
        "Volver a colocar los filtros en su lugar y verificar que estén correctamente instalados."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 17,
    nombre: "Inspección de válvulas de admisión",
    detalle: "Válvulas de admisión del compresor",
    funcion: "Garantizar un flujo de aire adecuado y prevenir fugas",
    detallesAdicionales: {
      descripcion: "La inspección regular de las válvulas de admisión es importante para garantizar un flujo de aire adecuado hacia el compresor y prevenir fugas que puedan afectar su rendimiento. Las válvulas dañadas o desgastadas pueden causar pérdida de presión y disminución del rendimiento. Es importante inspeccionar y limpiar o reemplazar las válvulas de admisión según sea necesario.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Acceder a las válvulas de admisión del compresor según las instrucciones del fabricante.",
        "Inspeccionar visualmente las válvulas en busca de signos de desgaste, daño o acumulación de suciedad.",
        "Limpiar las válvulas con un solvente suave y un cepillo suave si es necesario.",
        "Reemplazar las válvulas si están dañadas o desgastadas.",
        "Volver a montar las válvulas en su lugar y verificar que estén correctamente selladas."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 18,
    nombre: "Revisión de compresor de aire",
    detalle: "Compresor de aire completo",
    funcion: "Detectar y reparar posibles problemas para garantizar un funcionamiento eficiente",
    detallesAdicionales: {
      descripcion: "La revisión completa del compresor de aire es esencial para detectar y reparar posibles problemas que puedan afectar su rendimiento y durabilidad. Esto incluye la inspección de todos los componentes principales, como el motor, el compresor, los filtros y las válvulas, así como la realización de pruebas de funcionamiento para verificar su operación correcta. Es importante llevar a cabo esta revisión de forma regular para mantener el compresor en óptimas condiciones.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Realizar una inspección visual de todas las partes del compresor en busca de signos de desgaste, daño o corrosión.",
        "Limpiar cualquier suciedad o residuo presente en el compresor utilizando aire comprimido o un solvente suave.",
        "Verificar el estado de los filtros y las válvulas y reemplazarlos si es necesario.",
        "Realizar pruebas de funcionamiento del compresor para verificar su operación correcta.",
        "Registrar cualquier problema detectado durante la revisión y tomar las medidas correctivas necesarias."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 19,
    nombre: "Revisión de sistema de control",
    detalle: "Sistema de control del compresor",
    funcion: "Garantizar un control preciso y seguro del compresor",
    detallesAdicionales: {
      descripcion: "La revisión del sistema de control del compresor es importante para garantizar un funcionamiento seguro y eficiente. Esto incluye la inspección de los controles de presión, temperatura y flujo, así como la verificación de la calibración y el funcionamiento correcto de los dispositivos de seguridad. Es importante realizar esta revisión de forma regular para detectar y corregir cualquier problema antes de que afecte el rendimiento del compresor.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Inspeccionar visualmente todos los controles y dispositivos del sistema de control en busca de daños o signos de desgaste.",
        "Verificar la calibración y el funcionamiento correcto de los dispositivos de control y seguridad.",
        "Realizar pruebas de funcionamiento del sistema de control para asegurarse de que responda correctamente.",
        "Registrar cualquier problema detectado durante la revisión y tomar las medidas correctivas necesarias."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },
  { 
    id: 20,
    nombre: "Revisión de drenaje de condensado",
    detalle: "Sistema de drenaje de condensado del compresor",
    funcion: "Evitar la acumulación de agua y prevenir daños por corrosión",
    detallesAdicionales: {
      descripcion: "La revisión del sistema de drenaje de condensado es esencial para prevenir la acumulación de agua en el compresor y evitar daños por corrosión. El agua condensada puede acumularse en el compresor y provocar problemas de corrosión en los componentes internos. Es importante inspeccionar y limpiar regularmente el sistema de drenaje para garantizar un funcionamiento eficiente y prolongar la vida útil del compresor.",
      pasos: [
        "Apagar el compresor y desconectar la alimentación eléctrica.",
        "Localizar el sistema de drenaje de condensado y acceder a él según las instrucciones del fabricante.",
        "Inspeccionar visualmente el sistema de drenaje en busca de obstrucciones o acumulaciones de suciedad.",
        "Limpiar cualquier obstrucción utilizando aire comprimido o un solvente suave.",
        "Verificar que el sistema de drenaje esté funcionando correctamente y que el agua se drene adecuadamente.",
        "Registrar cualquier problema detectado durante la revisión y tomar las medidas correctivas necesarias."
      ],
      imagen: "assets/demos/sev_ele_2.gif"
    }
  },

];


  seleccionarMantenimiento(data: any) {
    console.log(data);
    this.mantenimientoSeleccionado = data;
    this.cambiarPantalla(3);
  }

}
