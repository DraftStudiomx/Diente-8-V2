// Local copy of all site content, ported from the static HTML site.
// Used until Sanity is connected, and as a fallback if Sanity is unreachable.
import type { Branch, Doctor, Faq, ImageRef, Insurer, SiteContent, SiteSettings, Specialty } from './types';

const photo = (file: string, alt: string): ImageRef => ({ src: `/assets/content/${file}`, alt, width: 1600, height: 1200 });

export const settings: SiteSettings = {
  name: 'Diente8 Clínica Dental',
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the final domain is connected.
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diente8-landing.vercel.app').replace(/\/$/, ''),
  description:
    'Diente8: clínica dental en León, Guanajuato con 11 especialidades bajo un mismo techo y 2 sucursales (Panorama y La Martinica). Odontología general, ortodoncia, implantología, endodoncia, odontopediatría y más.',
  whatsapp: null, // pending: confirm the clinic's WhatsApp number
  whatsappMessage: 'Hola, me gustaría agendar una valoración en Diente8.',
  phone: null,
  email: null,
  instagram: 'https://instagram.com/diente8_',
  facebook: 'https://facebook.com/diente8',
  years: 19,
  patients: 2000,
  patientsLabel: 'pacientes registrados desde 2025',
};

// Detail-page copy per specialty: H1 for local search, signs that it's time to visit, and what's treated.
// Written from general dental practice; pending review by the clinic before launch.
const DETAILS: Record<string, { headline: string; whenToVisit: string[]; treatments: string[] }> = {
  'odontologia-general': {
    headline: 'Dentista general en León',
    whenToVisit: [
      'Han pasado más de seis meses desde tu última revisión.',
      'Sientes molestia con lo frío, lo caliente o lo dulce.',
      'Notas manchas o puntos oscuros en algún diente.',
      'Tus encías sangran al cepillarte.',
      'Tienes una molestia y no sabes qué especialista necesitas.',
    ],
    treatments: ['Limpieza dental (profilaxis)', 'Revisión y diagnóstico', 'Resinas para caries', 'Selladores', 'Canalización con el especialista indicado'],
  },
  endodoncia: {
    headline: 'Endodoncia en León',
    whenToVisit: [
      'Tienes un dolor de muela intenso o que te despierta por la noche.',
      'La sensibilidad al frío o al calor dura varios minutos.',
      'Un diente se ha oscurecido.',
      'Hay inflamación o una pequeña bolita en la encía cerca de un diente.',
      'Te diagnosticaron una caries profunda o un diente fracturado.',
    ],
    treatments: ['Tratamiento de conductos', 'Retratamiento de conductos', 'Atención de urgencia por dolor', 'Diagnóstico con radiografía'],
  },
  periodoncia: {
    headline: 'Periodoncia en León',
    whenToVisit: [
      'Tus encías sangran al cepillarte o al usar hilo dental.',
      'Tus encías están inflamadas, rojas o se ven retraídas.',
      'Tienes mal aliento persistente.',
      'Sientes que algún diente se mueve o se ha separado.',
    ],
    treatments: [
      'Tratamiento de gingivitis y periodontitis',
      'Limpieza profunda (raspado y alisado radicular)',
      'Mantenimiento periodontal',
      'Cirugía periodontal',
      'Preparación de encías para implantes',
    ],
  },
  'odontologia-estetica': {
    headline: 'Odontología estética en León',
    whenToVisit: [
      'Tus dientes se ven manchados u oscuros.',
      'Tienes dientes desgastados, astillados o de forma irregular.',
      'Hay espacios pequeños entre tus dientes.',
      'Quieres renovar tu sonrisa para un evento o para ti.',
    ],
    treatments: ['Blanqueamiento dental', 'Carillas', 'Coronas estéticas', 'Resinas estéticas', 'Diseño de sonrisa'],
  },
  'protesis-e-implantologia': {
    headline: 'Implantes dentales y prótesis en León',
    whenToVisit: [
      'Perdiste uno o varios dientes.',
      'Tu prótesis actual está floja o es incómoda.',
      'Tienes dientes muy dañados que ya no se pueden restaurar.',
      'Te cuesta masticar ciertos alimentos.',
    ],
    treatments: ['Implantes dentales', 'Coronas y puentes', 'Prótesis fijas', 'Prótesis removibles', 'Rehabilitación sobre implantes'],
  },
  'protesis-maxilofacial': {
    headline: 'Prótesis maxilofacial en León',
    whenToVisit: [
      'Perdiste estructuras de la boca o la cara por una cirugía oncológica.',
      'Tienes un defecto congénito, como paladar hendido.',
      'Sufriste un traumatismo facial.',
      'Te cuesta hablar, comer o tragar después de una cirugía.',
    ],
    treatments: ['Obturadores palatinos', 'Prótesis faciales', 'Guías y férulas', 'Rehabilitación funcional y estética'],
  },
  'cirugia-maxilofacial': {
    headline: 'Cirujano maxilofacial en León',
    whenToVisit: [
      'Tus muelas del juicio duelen o no terminan de salir.',
      'Sufriste un golpe en la cara o la mandíbula.',
      'Tu mordida no cierra bien.',
      'Te falta hueso para colocar un implante.',
    ],
    treatments: ['Extracción de terceros molares', 'Extracciones complejas', 'Cirugía ortognática', 'Atención de fracturas faciales', 'Injertos óseos'],
  },
  'patologia-bucal': {
    headline: 'Patología bucal en León',
    whenToVisit: [
      'Tienes una llaga o úlcera que no sana en dos semanas.',
      'Notas manchas blancas o rojas en la boca.',
      'Apareció un bulto o una inflamación sin causa clara.',
      'Hay cambios en tus encías, lengua o labios.',
      'Otro especialista te pidió una biopsia.',
    ],
    treatments: ['Diagnóstico de lesiones bucales', 'Biopsia', 'Seguimiento de lesiones', 'Detección oportuna'],
  },
  anestesiologia: {
    headline: 'Sedación y anestesia dental en León',
    whenToVisit: [
      'Tu tratamiento será largo o complejo.',
      'Sientes miedo o ansiedad intensa al dentista.',
      'El paciente tiene necesidades especiales.',
      'Un niño necesita un tratamiento extenso.',
    ],
    treatments: ['Valoración preanestésica', 'Sedación consciente', 'Anestesia general', 'Monitoreo durante el procedimiento'],
  },
  ortodoncia: {
    headline: 'Ortodoncia en León',
    whenToVisit: [
      'Tus dientes están chuecos o encimados.',
      'Hay espacios entre tus dientes.',
      'Tu mordida no coincide: dientes muy adelante, muy atrás o cruzados.',
      'Tu hijo tiene alrededor de 7 años y no ha tenido una valoración.',
    ],
    treatments: ['Brackets metálicos', 'Brackets estéticos', 'Alineadores invisibles', 'Ortopedia en niños', 'Retenedores'],
  },
  odontopediatria: {
    headline: 'Dentista para niños en León',
    whenToVisit: [
      'Le salió el primer diente a tu bebé, o está por cumplir un año.',
      'Ves manchas o caries en sus dientes de leche.',
      'Se golpeó un diente.',
      'Usa chupón o se chupa el dedo después de los tres años.',
      'Le tiene miedo al dentista.',
    ],
    treatments: ['Revisión y limpieza infantil', 'Flúor y selladores', 'Tratamientos en dientes de leche', 'Mantenedores de espacio', 'Hábitos de higiene para toda la familia'],
  },
};

const sp = (
  number: string,
  slug: string,
  name: string,
  category: string,
  file: string,
  teaser: string,
  summary: string,
): Specialty => {
  const d = DETAILS[slug];
  return {
    slug,
    number,
    name,
    category,
    teaser,
    summary,
    headline: d.headline,
    whenToVisit: d.whenToVisit,
    treatments: d.treatments,
    image: photo(file, `${name} en Diente8, León`),
    seoTitle: d.headline,
    seoDescription: `${summary.replace(/\.$/, '')}. ${d.headline}, Guanajuato: Diente8 Panorama y La Martinica.`,
  };
};

export const specialties: Specialty[] = [
  sp('01', 'odontologia-general', 'Odontología general', 'Restauradora', 'panorama-atencion.jpg',
    'Limpiezas, revisión de rutina y la puerta de entrada al especialista correcto.',
    'El punto de partida: limpiezas, revisión de rutina y curación de caries con resinas — y la puerta de entrada al especialista correcto cuando hace falta.'),
  sp('02', 'endodoncia', 'Endodoncia', 'Restauradora', 'martinica-instrumental.jpg',
    'Tratamiento de conducto para salvar piezas dañadas.',
    'Tratamiento de conducto para salvar piezas infectadas o dañadas gravemente, con técnica moderna enfocada en aliviar el dolor.'),
  sp('03', 'periodoncia', 'Periodoncia', 'Restauradora', 'panorama-consultorio.jpg',
    'Encías sanas y tejidos de soporte firmes.',
    'Diagnóstico, prevención y tratamiento de las enfermedades de encías y tejidos de soporte, como la gingivitis y la periodontitis.'),
  sp('04', 'odontologia-estetica', 'Odontología estética', 'Estética y prótesis', 'martinica-consultorio.jpg',
    'Blanqueamiento, coronas y diseño de sonrisa.',
    'Blanqueamiento, coronas y diseño de sonrisa, enfocados en mejorar la apariencia de tu sonrisa sin sacrificar la salud del diente.'),
  sp('05', 'protesis-e-implantologia', 'Prótesis e implantología', 'Estética y prótesis', 'martinica-pantalla-rx.jpg',
    'Implantes, coronas, puentes y prótesis fijas o removibles.',
    'Sustitución de dientes perdidos o dañados con implantes, coronas, puentes y prótesis fijas o removibles.'),
  sp('06', 'protesis-maxilofacial', 'Prótesis maxilofacial', 'Estética y prótesis', 'panorama-recepcion.jpg',
    'Rehabilitación estética y funcional del rostro y la boca.',
    'Rehabilitación estética y funcional de estructuras perdidas por defectos congénitos, traumatismos o cirugías oncológicas.'),
  sp('07', 'cirugia-maxilofacial', 'Cirugía maxilofacial', 'Cirugía y diagnóstico', 'panorama-letrero.jpg',
    'Terceros molares, traumatismos y corrección de la mordida.',
    'Extracción de terceros molares, traumatismos faciales, corrección de la mordida y reconstrucción ósea.'),
  sp('08', 'patologia-bucal', 'Patología bucal', 'Cirugía y diagnóstico', 'martinica-instrumental.jpg',
    'Diagnóstico de lesiones y alteraciones de la boca.',
    'Diagnóstico de enfermedades, lesiones, tumores o alteraciones que afectan los tejidos de la boca y zonas maxilofaciales.'),
  sp('09', 'anestesiologia', 'Anestesiólogo (en odontología)', 'Cirugía y diagnóstico', 'panorama-consultorio.jpg',
    'Sedación consciente y anestesia general.',
    'Sedación consciente o anestesia general para procedimientos complejos, o para pacientes con necesidades especiales.'),
  sp('10', 'ortodoncia', 'Ortodoncia', 'Ortodoncia y niños', 'panorama-atencion.jpg',
    'Brackets, alineadores invisibles y retenedores.',
    'Corrección de la mala posición de los dientes y la mordida con brackets, alineadores invisibles y retenedores.'),
  sp('11', 'odontopediatria', 'Odontopediatría', 'Ortodoncia y niños', 'martinica-area-infantil.jpg',
    'Atención integral para bebés, niños y adolescentes.',
    'Atención integral para bebés, niños y adolescentes, enfocada en la prevención y en perderle el miedo al dentista desde pequeños.'),
];

// The home page previews these three, in this order.
export const homeSpecialtySlugs = ['odontologia-general', 'protesis-e-implantologia', 'odontopediatria'];

export const branches: Branch[] = [
  {
    slug: 'panorama',
    name: 'Panorama',
    fullName: 'Diente8 Panorama',
    addressLines: ['Consultorio #158,', 'León, Gto.'],
    streetAddress: '',
    mapUrl: null,
    phone: null,
    photo: photo('panorama-fachada.jpg', 'Fachada de Diente8 Panorama en León'),
    note: 'Ortodoncia · Odontología estética · Cirugía maxilofacial, entre otras especialidades.',
  },
  {
    slug: 'martinica',
    name: 'La Martinica',
    fullName: 'Diente8 La Martinica',
    addressLines: ['San Sebastián 322,', 'La Martinica, León, Gto.'],
    streetAddress: 'San Sebastián 322',
    mapUrl: null,
    phone: null,
    photo: photo('martinica-fachada.jpg', 'Fachada de Diente8 La Martinica en León'),
    note: 'Ortodoncia · Odontología estética · Cirugía maxilofacial, entre otras especialidades.',
  },
];

const dr = (
  stripOrder: number,
  slug: string,
  title: Doctor['title'],
  name: string,
  shortName: string,
  specialtyLabel: string,
  specialtySlugs: string[],
  branch: Doctor['branch'] = null,
): Doctor => ({
  slug,
  title,
  name,
  shortName,
  specialtyLabel,
  specialties: specialtySlugs,
  branch,
  photo: { src: `/assets/equipo/${slug}.webp`, alt: `${title} ${name}, ${specialtyLabel}`, width: 320, height: 320 },
  featured: slug === 'fernando-tenorio',
  bio: null,
  stripOrder,
});

// Order of the team page.
export const doctors: Doctor[] = [
  dr(5, 'jocelyn-moreno', 'Dra.', 'Jocelyn Moreno Ramírez', 'Jocelyn Moreno', 'Odontología general', ['odontologia-general']),
  dr(6, 'paola-campos', 'Dra.', 'Paola Campos Ibarra', 'Paola Campos', 'Endodoncia', ['endodoncia']),
  dr(4, 'mireya-ruiz', 'Dra.', 'Mireya Ruiz Santos', 'Mireya Ruiz', 'Periodoncia e implantología', ['periodoncia', 'protesis-e-implantologia']),
  dr(1, 'carla-leon', 'Dra.', 'Carla León López', 'Carla León', 'Odontología estética', ['odontologia-estetica'], 'martinica'),
  dr(2, 'ana-guevara', 'Dra.', 'Ana Guevara Vázquez', 'Ana Guevara', 'Odontología estética', ['odontologia-estetica'], 'panorama'),
  dr(3, 'alejandro-ito', 'Dr.', 'Alejandro Ito Tsuchiya', 'Alejandro Ito', 'Prótesis e implantología', ['protesis-e-implantologia']),
  dr(8, 'liliana-salome', 'Dra.', 'Liliana Salomé Díaz', 'Liliana Salomé', 'Prótesis maxilofacial', ['protesis-maxilofacial']),
  dr(14, 'edgar-zavala', 'Dr.', 'Edgar Zavala Alvarado', 'Edgar Zavala', 'Cirugía maxilofacial', ['cirugia-maxilofacial']),
  dr(13, 'alberto-flores', 'Dr.', 'Alberto Flores Longoria', 'Alberto Flores Longoria', 'Cirugía maxilofacial', ['cirugia-maxilofacial']),
  dr(7, 'fernando-tenorio', 'Dr.', 'Fernando Tenorio Rocha', 'Fernando Tenorio', 'Patología bucal', ['patologia-bucal']),
  dr(15, 'christian-sepulveda', 'Dr.', 'Christian Sepúlveda Herrera', 'Christián Sepúlveda', 'Médico anestesiólogo', ['anestesiologia']),
  dr(10, 'mariana-carrillo', 'Dra.', 'Mariana Carrillo Hernández', 'Mariana Carrillo', 'Ortodoncia', ['ortodoncia']),
  dr(9, 'david-ortiz', 'Dr.', 'José David Ortiz Sánchez', 'David Ortiz', 'Ortodoncia', ['ortodoncia']),
  dr(12, 'carolina-ramirez', 'Dra.', 'Carolina Ramírez Ramírez', 'Carolina Ramírez', 'Odontopediatría', ['odontopediatria'], 'panorama'),
  dr(11, 'francisco-palacios', 'Dr.', 'Francisco Palacios', 'Francisco Palacios', 'Odontopediatría', ['odontopediatria'], 'martinica'),
];

export const insurers: Insurer[] = [
  { name: 'AUNA', logo: { src: '/assets/aseguradoras/auna.svg', alt: 'AUNA', width: 360, height: 81 } },
  { name: 'Centauro', logo: { src: '/assets/aseguradoras/centauro.png', alt: 'Centauro', width: 286, height: 78 } },
  { name: 'dentalia', logo: { src: '/assets/aseguradoras/dentalia.svg', alt: 'dentalia', width: 96, height: 22 } },
  { name: 'Odontoprev', logo: { src: '/assets/aseguradoras/odontoprev.png', alt: 'Odontoprev', width: 351, height: 101 } },
];

export const faqs: Faq[] = [
  {
    question: '¿En qué se diferencia Diente8 de una clínica dental normal?',
    answer:
      'Reunimos 11 especialidades bajo un mismo techo y un mismo expediente. Si tu tratamiento involucra a más de un especialista, no tienes que repetir tu historial en cada consultorio.',
  },
  {
    question: '¿Cuál es la diferencia entre las sucursales Panorama y La Martinica?',
    answer:
      'Ambas ofrecen atención dental completa y comparten el mismo equipo y expediente clínico — la que elijas depende simplemente de cuál te queda más cerca. Consulta la dirección de cada una en la sección de sucursales.',
  },
  {
    question: '¿Trabajan con seguros dentales?',
    answer:
      'Sí. Trabajamos con seguros dentales tanto para pacientes particulares como para empresas que buscan dar cobertura dental a sus colaboradores. Escríbenos para confirmar si tu póliza aplica.',
  },
  {
    question: '¿Atienden niños?',
    answer:
      'Sí, contamos con odontopediatría dedicada, enfocada en que los niños pierdan el miedo al dentista desde la primera visita.',
  },
  {
    question: 'No sé qué especialidad necesito, ¿cómo empiezo?',
    answer:
      'No hace falta que lo sepas de antemano. Agenda una valoración inicial y te canalizamos con el especialista correcto dentro de la misma clínica.',
  },
  {
    question: '¿Cómo agendo mi primera cita?',
    answer: 'Escríbenos desde la sección de contacto y te confirmamos horario el mismo día.',
  },
];

export const localContent: SiteContent = { settings, specialties, doctors, branches, insurers, faqs, homeSpecialties: homeSpecialtySlugs };
