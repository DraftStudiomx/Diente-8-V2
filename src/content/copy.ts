// Default site copy, taken from the current site. Used until the "Textos del sitio" document is published in
// Sanity, as the Studio's initial values for that document, and as a per-field fallback.
import type { SiteCopy } from './types';

export const localCopy: SiteCopy = {
  navCta: 'Agenda tu cita',
  ctaTitle: '¿Primera vez en Diente 8?',
  ctaText: 'Cuéntanos qué necesitas y te ayudamos a encontrar la especialidad correcta antes de tu primera visita — sin compromiso.',
  ctaButton: 'Escríbenos por WhatsApp',
  footerTitle: 'Tu sonrisa no debería esperar otro año.',
  footerButton: 'Agenda tu cita',

  heroEyebrow: 'Clínica dental en León, Guanajuato',
  heroTitle1: '{años} años cuidando',
  heroTitle2: 'la sonrisa de *tu familia*',
  heroText:
    '{especialidades} especialidades de la odontología bajo un mismo techo, en 2 sucursales — Panorama y La Martinica — con un trato cercano para que cuidar tus dientes deje de ser algo que se posterga.',
  heroCtaPrimary: 'Agenda tu cita',
  heroCtaSecondary: 'Ver especialidades',
  toothLayers: [
    { layer: '01 · Esmalte', name: 'Odontología estética', description: 'Carillas, coronas, blanqueamiento y diseño de sonrisa.', short: 'Carillas, coronas y blanqueamiento.', specialty: 'odontologia-estetica' },
    { layer: '02 · Pulpa', name: 'Endodoncia', description: 'Tratamos el nervio para conservar tu diente.', short: 'Tratamos el nervio para conservar tu diente.', specialty: 'endodoncia' },
    { layer: '03 · Dentina', name: 'Odontología general', description: 'Resinas y restauraciones que devuelven forma y función.', short: 'Resinas y restauraciones a tu medida.', specialty: 'odontologia-general' },
    { layer: '04 · Raíz y encía', name: 'Periodoncia e implantes', description: 'La base de todo: encías sanas y raíces firmes.', short: 'Encías sanas y raíces firmes.', specialty: 'periodoncia' },
  ],
  finaleLine: 'Cada parte de tu diente, *un solo lugar* para cuidarla.',
  statYearsLabel: 'años de experiencia',
  statSpecialtiesLabel: 'especialidades bajo un techo',
  painText:
    'Cambiar de dentista según el problema *—uno para los niños, otro para las encías, otro para las prótesis—* hace que la mayoría termine posponiendo el tratamiento completo. Y lo que se pospone, se complica.',
  pillars: [
    'Un equipo, un historial — no repites tu caso en cada consultorio',
    'Técnica moderna, mínimamente invasiva',
    'Trato pensado para toda la familia, de niños a adultos mayores',
  ],
  homeSpecialtiesTitle: 'Especialidades',
  homeSpecialtiesMeta: '{especialidades} áreas, un mismo expediente',
  homeSpecialtiesLink: 'Ver las {especialidades} especialidades →',
  homeBranchesTitle: 'Sucursales',
  homeBranchesMeta: 'Dos ubicaciones en León',
  homeBranchesLink: 'Ver ambas sucursales →',
  homeTeamTitle: 'Equipo',
  homeTeamMeta: '{especialistas} especialistas',
  homeTeamLink: 'Conoce a todo el equipo →',
  aboutTitle: 'Casi dos décadas construyendo *confianza*, no solo tratando dientes.',
  aboutItems: [
    { title: 'Todas las especialidades, un equipo', text: 'No coordinas entre distintas clínicas: tu historial y tu tratamiento viajan contigo dentro de Diente8.' },
    {
      title: 'Técnica moderna, trato humano',
      text: 'Usamos procedimientos mínimamente invasivos, pero la conversación antes de cada tratamiento sigue siendo con una persona, no un formulario.',
    },
    { title: 'Pensado para toda la familia', text: 'Desde el primer diente de leche hasta la rehabilitación de un adulto mayor, en Panorama y La Martinica, León.' },
  ],
  faqTitle: 'Preguntas frecuentes',
  videoLabel: 'Lo que dicen nuestros pacientes',

  specialtiesTitle: 'Especialidades',
  specialtiesMeta: '{especialidades} áreas, un mismo expediente',
  cardMore: 'Ver especialidad →',
  spCtaPrimary: 'Agenda tu valoración',
  spTeamButtonOne: 'Conoce a tu especialista',
  spTeamButtonMany: 'Conoce a los especialistas',
  spWhenTitle: '¿Cuándo acudir?',
  spTreatTitle: 'Qué tratamos',
  spWhereOne: 'Disponible en Diente8 {sucursal}.',
  spWhereAll: 'Disponible en Panorama y La Martinica, según la agenda de cada especialista.',
  spTeamTitleOne: 'Tu especialista',
  spTeamTitleMany: 'Especialistas',
  spFeaturedLabel: 'Especialista destacado',
  spMoreTitle: 'Otras especialidades',
  spMoreMeta: 'Un mismo expediente para todas',

  branchesTitle: 'Sucursales',
  branchesMeta: 'Dos ubicaciones en León',
  branchesMapLink: 'Cómo llegar →',

  teamTitle: 'Equipo',
  teamMeta: '{especialistas} especialistas',
  teamIntro: 'Panorama y La Martinica en dos de las especialidades comparten equipo — el resto de los especialistas rota entre sucursales según agenda.',

  contactEyebrow: 'Contáctanos',
  contactTitle: 'Hablemos de tu sonrisa.',
  contactLead: 'Escríbenos, agenda tu valoración o consulta si tu seguro dental aplica en Diente8.',
  contactSocialLabel: 'Síguenos',
  contactAgendaLabel: 'Agenda',
  contactAgendaText: 'Escríbenos y te confirmamos horario el mismo día.',
  contactAgendaButton: 'Agenda tu cita',
  companiesEyebrow: 'Empresas y seguros dentales',
  companiesTitle: 'Una molestia dental también le cuesta tiempo a tu empresa.',
  companiesText:
    'Trabajamos con seguros dentales que facilitan la atención de tus colaboradores — acceso directo a las {especialidades} especialidades, diagnósticos oportunos y menos ausentismo por citas dispersas entre clínicas.',
  insurersLabel: 'Aseguradoras con las que trabajamos',
  insurersButton: '¿Tu aseguradora aplica? Pregúntanos',
};
