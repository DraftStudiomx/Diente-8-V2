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
  featuredLink: 'Ver {especialidad} →',
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

  hoursLabel: 'Horario',
  contactWhatsappLabel: 'WhatsApp',
  floatingWhatsapp: 'Escríbenos por WhatsApp',
  formEyebrow: 'Agenda tu valoración',
  formTitle: 'Déjanos tus datos y te contactamos.',
  formText: 'Te confirmamos día y hora en horario de atención. Si lo prefieres, escríbenos directo por WhatsApp.',
  formName: 'Nombre',
  formPhone: 'Teléfono o WhatsApp',
  formEmail: 'Correo (opcional)',
  formBranch: 'Sucursal de preferencia',
  formBranchAny: 'Cualquiera',
  formReason: 'Motivo de la consulta',
  formReasonUnknown: 'No sé, necesito una valoración',
  formMessage: 'Mensaje (opcional)',
  formPrivacy: 'He leído y acepto el *aviso de privacidad*.',
  formButton: 'Enviar',
  formSending: 'Enviando…',
  formSuccess: '¡Gracias! Recibimos tus datos y te contactaremos pronto para confirmar tu cita.',
  formError: 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.',

  privacyTitle: 'Aviso de privacidad',
  privacyUpdated: 'Última actualización: noviembre de 2026',
  privacyBody: `## Responsable
Diente8 Clínica Dental (en adelante, "Diente8"), con domicilios en C. Pedro Lyonnet 158, Panorama, 37160, y C. San Sebastián 324, La Martinica, 37500, ambos en León, Guanajuato, es responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio web.

## Datos que recabamos
Por medio del formulario de contacto recabamos tu nombre, teléfono, correo electrónico (opcional), la sucursal de tu preferencia y, si decides compartirlo, el motivo de tu consulta. El motivo de consulta puede referirse a tu estado de salud, por lo que se considera un dato personal sensible; solo lo tratamos con tu consentimiento expreso, que otorgas al marcar la casilla de aceptación del formulario.

## Para qué usamos tus datos
Usamos tus datos únicamente para contactarte, agendar tu cita o valoración y responder a tu solicitud. No los usamos con fines publicitarios ni los vendemos.

## Con quién los compartimos
No compartimos tus datos con terceros, salvo con los proveedores tecnológicos que nos ayudan a operar este sitio y a recibir los mensajes del formulario (alojamiento web y envío de correo), quienes los tratan solo por cuenta de Diente8, y cuando lo exija una autoridad competente conforme a la ley.

## Tus derechos
Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), así como revocar tu consentimiento, enviando tu solicitud a diente8899@gmail.com con tu nombre, un medio para responderte y la descripción de lo que solicitas. Te responderemos en los plazos que establece la ley.

## Cambios a este aviso
Cualquier cambio a este aviso de privacidad se publicará en esta misma página.`,
};
