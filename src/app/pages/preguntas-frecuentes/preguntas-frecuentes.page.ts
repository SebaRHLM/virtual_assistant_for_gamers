import { Component } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.page.html',
  styleUrls: ['./preguntas-frecuentes.page.scss'],
  standalone : false
})
export class PreguntasFrecuentesPage {
  faqCategories = [
    {
      name: 'Compatibilidad de Componentes',
      icon: 'hardware-chip',
      questions: [
        {
          question: '¿Cómo sé si mi placa de video es compatible con mi motherboard?',
          answer: 'La compatibilidad depende principalmente del slot PCIe. Todas las placas de video modernas usan PCIe x16, que es compatible con versiones anteriores. Lo crucial es verificar el espacio físico en tu gabinete y que tu fuente de poder tenga los conectores necesarios.',
          expanded: false
        },
        {
          question: '¿Qué debo considerar al elegir una fuente de poder?',
          answer: 'Debes calcular el consumo total de tu sistema (CPU + GPU + otros componentes) y agregar un 20-30% de margen. También verifica los conectores (PCIe para GPU, EPS para CPU) y la certificación de eficiencia (80 Plus Bronze, Gold, etc.).',
          expanded: false
        },
        {
          question: '¿Puedo mezclar memorias RAM de diferentes marcas o velocidades?',
          answer: 'Sí, pero no es recomendable. Las RAM funcionarán a la velocidad del módulo más lento. Para mejor estabilidad, usa kits idénticos de la misma marca, modelo y velocidad.',
          expanded: false
        }
      ]
    },
    {
      name: 'Comparación de Productos',
      icon: 'stats-chart',
      questions: [
        {
          question: '¿Qué es más importante: tasa de refresco o tiempo de respuesta?',
          answer: 'Depende del uso. Para gaming competitivo (FPS), prioriza tasa de refresco (144Hz+). Para juegos casuales o trabajo, el tiempo de respuesta (1ms-5ms) y la calidad del panel (IPS, VA) son más importantes.',
          expanded: false
        },
        {
          question: '¿Teclado mecánico vs membrana para gaming?',
          answer: 'Los mecánicos ofrecen mejor respuesta táctil, durabilidad y personalización. Las membranas son más silenciosas y económicas. Para gaming, los mecánicos son generalmente superiores.',
          expanded: false
        },
        {
          question: '¿Ventilación líquida o por aire para el CPU?',
          answer: 'Líquida: mejor rendimiento en overclocking y estética. Aire: más confiable, menos mantenimiento y generalmente más silencioso. Para la mayoría de usuarios, un buen cooler de aire es suficiente.',
          expanded: false
        }
      ]
    },
    {
      name: 'Soporte Técnico',
      icon: 'help-circle',
      questions: [
        {
          question: '¿Qué hago si mi componente nuevo no funciona?',
          answer: '1. Verifica las conexiones. 2. Actualiza los drivers. 3. Prueba en otro puerto/ranura. 4. Consulta compatibilidad con nuestro asistente virtual. Si persiste el problema, contacta a soporte técnico.',
          expanded: false
        },
        {
          question: '¿Cómo mantengo mis componentes gaming?',
          answer: 'Limpieza regular con aire comprimido, actualización de drivers, monitoreo de temperaturas, y evitar overclocking extremo sin la refrigeración adecuada.',
          expanded: false
        },
        {
          question: '¿Garantía y políticas de devolución?',
          answer: 'Todos nuestros productos tienen garantía del fabricante (1-3 años). Las devoluciones se aceptan dentro de los 30 días posteriores a la compra, con el producto en perfecto estado y empaque original.',
          expanded: false
        }
      ]
    }
  ];

  toggleQuestion(categoryIndex: number, questionIndex: number): void {
    this.faqCategories[categoryIndex].questions[questionIndex].expanded = 
      !this.faqCategories[categoryIndex].questions[questionIndex].expanded;
  }

  // Función para buscar en las preguntas frecuentes
  searchTerm: string = '';
  
  get filteredCategories() {
    if (!this.searchTerm) {
      return this.faqCategories;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(term) || 
        q.answer.toLowerCase().includes(term)
      )
    })).filter(category => category.questions.length > 0);
  }
}
