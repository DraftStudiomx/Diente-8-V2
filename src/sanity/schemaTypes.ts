import { defineArrayMember, defineField, defineType } from 'sanity';
import { localCopy } from '../content/copy';
import type { SiteCopy } from '../content/types';

// Content model for the clinic's editors. Labels are in Spanish; field names match src/content/types.ts.

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        description: 'Describe la imagen para lectores de pantalla y Google.',
        validation: (r) => r.required(),
      }),
    ],
    validation: (r) => r.required(),
  });

const orderField = defineField({
  name: 'order',
  title: 'Orden',
  type: 'number',
  description: 'Posición en la página (1 = primero).',
  validation: (r) => r.required().integer().min(1),
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Datos de la clínica',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Descripción para Google', type: 'text', rows: 3, validation: (r) => r.required().max(300) }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp para citas',
      type: 'string',
      description: 'Solo números, con 52 al inicio. Ejemplo: 524771234567. Mientras esté vacío, los botones llevan a Contacto.',
      validation: (r) => r.regex(/^52\d{10}$/, { name: 'número de 12 dígitos que empiece con 52' }),
    }),
    defineField({ name: 'whatsappMessage', title: 'Mensaje inicial de WhatsApp', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Teléfono general', type: 'string' }),
    defineField({ name: 'email', title: 'Correo de contacto', type: 'string', validation: (r) => r.email() }),
    defineField({ name: 'instagram', title: 'Instagram (URL)', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook (URL)', type: 'url' }),
    defineField({ name: 'years', title: 'Años de experiencia', type: 'number', validation: (r) => r.required().integer() }),
    defineField({ name: 'patients', title: 'Pacientes (cifra)', type: 'number', validation: (r) => r.required().integer() }),
    defineField({ name: 'patientsLabel', title: 'Texto bajo la cifra de pacientes', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'homeSpecialties',
      title: 'Especialidades en el Inicio',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'specialty' }] })],
      validation: (r) => r.length(3),
    }),
    defineField({
      name: 'legalName',
      title: 'Nombre legal del responsable',
      type: 'string',
      description: 'Nombre completo de la persona física o razón social, como aparece ante el SAT. Se usa en el aviso de privacidad.',
    }),
    defineField({
      name: 'legalAddress',
      title: 'Domicilio para notificaciones',
      type: 'string',
      description: 'Se usa en el aviso de privacidad. Si se deja vacío, se muestran las direcciones de las sucursales.',
    }),
    defineField({ name: 'sanitaryName', title: 'Responsable sanitario', type: 'string', description: 'Nombre con título, ej. "Dra. Nombre Apellido". Se muestra en el pie de página.' }),
    defineField({ name: 'sanitaryLicense', title: 'Cédula profesional del responsable sanitario', type: 'string' }),
    defineField({
      name: 'sanitaryInstitution',
      title: 'Institución que expidió su título',
      type: 'string',
      description: 'Ej. "Universidad Nacional Autónoma de México".',
    }),
    defineField({
      name: 'cofeprisCode',
      title: 'Clave de COFEPRIS (aviso de publicidad)',
      type: 'string',
      description: 'Se muestra en el pie de página cuando COFEPRIS la asigne.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Datos de la clínica' }) },
});

export const specialty = defineType({
  name: 'specialty',
  title: 'Especialidad',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'name' },
      description: 'Cambiarla rompe los enlaces existentes en Google.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'number', title: 'Número (01–11)', type: 'string', validation: (r) => r.required().regex(/^\d{2}$/) }),
    defineField({ name: 'category', title: 'Grupo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'headline', title: 'Título de la página', type: 'string', description: 'Ej. "Endodoncia en León".', validation: (r) => r.required() }),
    defineField({ name: 'teaser', title: 'Frase corta (tarjetas del Inicio)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'summary', title: 'Descripción', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'whenToVisit', title: '¿Cuándo acudir?', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'treatments', title: 'Qué tratamos', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    imageWithAlt('image', 'Foto'),
    defineField({ name: 'seoTitle', title: 'Título para Google', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'Descripción para Google', type: 'text', rows: 3, validation: (r) => r.max(300) }),
  ],
  orderings: [{ title: 'Número', name: 'number', by: [{ field: 'number', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'number', media: 'image' } },
});

export const branch = defineType({
  name: 'branch',
  title: 'Sucursal',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre corto', type: 'string', description: 'Ej. "Panorama".', validation: (r) => r.required() }),
    defineField({ name: 'fullName', title: 'Nombre completo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      readOnly: true,
      description: 'Lo usa el sitio internamente; no se edita.',
    }),
    defineField({ name: 'addressLines', title: 'Dirección (una línea por renglón)', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'streetAddress', title: 'Calle y número (para Google)', type: 'string' }),
    defineField({ name: 'postalCode', title: 'Código postal', type: 'string', validation: (r) => r.regex(/^\d{5}$/, { name: '5 dígitos' }) }),
    defineField({ name: 'mapUrl', title: 'Enlace de Google Maps', type: 'url', description: 'El enlace de "Compartir" de Google Maps.' }),
    defineField({
      name: 'mapName',
      title: 'Nombre en Google Maps',
      type: 'string',
      description: 'Exactamente como aparece la clínica en Google Maps. Hace que el mapa del sitio muestre la ficha de la clínica y no solo la dirección.',
    }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({
      name: 'hours',
      title: 'Horario',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'hoursRow',
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Días', type: 'string', description: 'Ej. "Lunes a viernes".', validation: (r) => r.required() }),
            defineField({ name: 'time', title: 'Horas', type: 'string', description: 'Ej. "10:00 a 14:00 y 16:00 a 20:00".', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'days', subtitle: 'time' } },
        }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Horario para Google (formato técnico)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Días en inglés abreviados y horas de 24 h, una línea por bloque. Ej. "Mo-Fr 10:00-14:00", "Sa 09:00-15:00". Si cambias el horario de arriba, actualiza también este.',
    }),
    imageWithAlt('photo', 'Foto'),
    defineField({ name: 'note', title: 'Nota', type: 'string' }),
    orderField,
  ],
  preview: { select: { title: 'fullName', media: 'photo' } },
});

export const doctor = defineType({
  name: 'doctor',
  title: 'Especialista',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', options: { list: ['Dr.', 'Dra.'], layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Nombre completo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'shortName', title: 'Nombre corto', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Identificador', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'specialtyLabel', title: 'Especialidad (texto)', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'specialties',
      title: 'Especialidades',
      type: 'array',
      description: 'Define en qué páginas de especialidad aparece.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'specialty' }] })],
    }),
    defineField({ name: 'branch', title: 'Sucursal fija', type: 'reference', to: [{ type: 'branch' }], description: 'Vacío si rota entre sucursales.' }),
    imageWithAlt('photo', 'Foto'),
    defineField({ name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'bio', title: 'Semblanza', type: 'text', rows: 4, description: 'Se muestra si es especialista destacado.' }),
    orderField,
    defineField({ name: 'stripOrder', title: 'Orden en la plantilla del Inicio', type: 'number', validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: 'Orden', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', name: 'name', subtitle: 'specialtyLabel', media: 'photo' },
    prepare: ({ title, name, subtitle, media }) => ({ title: `${title ?? ''} ${name ?? ''}`.trim(), subtitle, media }),
  },
});

export const insurer = defineType({
  name: 'insurer',
  title: 'Aseguradora',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    imageWithAlt('logo', 'Logo (versión para fondo oscuro)'),
    orderField,
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      description: 'Escribe {aseguradoras} para mostrar la lista actual de aseguradoras.',
      validation: (r) => r.required(),
    }),
    orderField,
  ],
  preview: { select: { title: 'question' } },
});

// ---------- "Textos del sitio": every piece of copy that isn't a specialty, doctor, branch or FAQ ----------

const HINT_ACCENT = 'Lo que pongas entre *asteriscos* se ve en cursiva dorada.';
const HINT_VARS = 'Escribe {especialidades}, {especialistas} o {años} para mostrar el número actualizado automáticamente.';

type CopyField = [name: keyof SiteCopy, title: string, group: string, opts?: { long?: boolean; hint?: string }];

const COPY_FIELDS: CopyField[] = [
  ['navCta', 'Botón del menú', 'generales'],
  ['ctaTitle', 'Franja dorada · título', 'generales'],
  ['ctaText', 'Franja dorada · texto', 'generales', { long: true }],
  ['ctaButton', 'Franja dorada · botón', 'generales'],
  ['footerTitle', 'Cierre del Inicio · frase', 'generales'],
  ['footerButton', 'Cierre del Inicio · botón', 'generales'],

  ['heroEyebrow', 'Portada · texto superior', 'inicio'],
  ['heroTitle1', 'Portada · título, línea 1', 'inicio', { hint: HINT_VARS }],
  ['heroTitle2', 'Portada · título, línea 2', 'inicio', { hint: HINT_ACCENT }],
  ['heroText', 'Portada · texto', 'inicio', { long: true, hint: HINT_VARS }],
  ['heroCtaPrimary', 'Portada · botón principal', 'inicio'],
  ['heroCtaSecondary', 'Portada · botón secundario', 'inicio'],
  ['finaleLine', 'Cierre de la animación · frase', 'inicio', { hint: HINT_ACCENT }],
  ['statYearsLabel', 'Cifra de años · texto', 'inicio'],
  ['statSpecialtiesLabel', 'Cifra de especialidades · texto', 'inicio'],
  ['painText', 'Frase grande bajo la portada', 'inicio', { long: true, hint: HINT_ACCENT }],
  ['homeSpecialtiesTitle', 'Especialidades · título', 'inicio'],
  ['homeSpecialtiesMeta', 'Especialidades · subtítulo', 'inicio', { hint: HINT_VARS }],
  ['homeSpecialtiesLink', 'Especialidades · enlace', 'inicio', { hint: HINT_VARS }],
  ['homeBranchesTitle', 'Sucursales · título', 'inicio'],
  ['homeBranchesMeta', 'Sucursales · subtítulo', 'inicio'],
  ['homeBranchesLink', 'Sucursales · enlace', 'inicio'],
  ['homeTeamTitle', 'Equipo · título', 'inicio'],
  ['homeTeamMeta', 'Equipo · subtítulo', 'inicio', { hint: HINT_VARS }],
  ['homeTeamLink', 'Equipo · enlace', 'inicio'],
  ['aboutTitle', 'Nosotros · título', 'inicio', { hint: HINT_ACCENT }],
  ['faqTitle', 'Preguntas frecuentes · título', 'inicio'],
  ['videoLabel', 'Video · texto superior', 'inicio'],

  ['specialtiesTitle', 'Página Especialidades · título', 'especialidades'],
  ['specialtiesMeta', 'Página Especialidades · subtítulo', 'especialidades', { hint: HINT_VARS }],
  ['cardMore', 'Tarjetas · enlace "ver más"', 'especialidades'],
  ['spCtaPrimary', 'Página de especialidad · botón principal', 'especialidades'],
  ['spTeamButtonOne', 'Botón a especialistas (si es uno)', 'especialidades'],
  ['spTeamButtonMany', 'Botón a especialistas (si son varios)', 'especialidades'],
  ['spWhenTitle', 'Título "¿Cuándo acudir?"', 'especialidades'],
  ['spTreatTitle', 'Título "Qué tratamos"', 'especialidades'],
  ['spWhereOne', 'Disponibilidad (una sucursal)', 'especialidades', { hint: 'Usa {sucursal} para el nombre de la sucursal.' }],
  ['spWhereAll', 'Disponibilidad (ambas sucursales)', 'especialidades', { long: true }],
  ['spTeamTitleOne', 'Título de especialistas (si es uno)', 'especialidades'],
  ['spTeamTitleMany', 'Título de especialistas (si son varios)', 'especialidades'],
  ['spFeaturedLabel', 'Etiqueta de especialista destacado', 'especialidades', { hint: 'También se usa en Inicio y Equipo. El especialista destacado se elige con el interruptor "Destacado" de cada doctor.' }],
  ['featuredLink', 'Enlace del especialista destacado', 'especialidades', { hint: 'Escribe {especialidad} para mostrar el nombre de su especialidad.' }],
  ['spMoreTitle', 'Otras especialidades · título', 'especialidades'],
  ['spMoreMeta', 'Otras especialidades · subtítulo', 'especialidades'],

  ['branchesTitle', 'Título', 'sucursales'],
  ['branchesMeta', 'Subtítulo', 'sucursales'],
  ['branchesMapLink', 'Enlace a Google Maps', 'sucursales'],

  ['teamTitle', 'Título', 'equipo'],
  ['teamMeta', 'Subtítulo', 'equipo', { hint: HINT_VARS }],
  ['teamIntro', 'Introducción', 'equipo', { long: true }],

  ['contactEyebrow', 'Texto superior', 'contacto'],
  ['contactTitle', 'Título', 'contacto'],
  ['contactLead', 'Texto', 'contacto', { long: true }],
  ['contactSocialLabel', 'Redes · etiqueta', 'contacto'],
  ['contactAgendaLabel', 'Agenda · etiqueta', 'contacto'],
  ['contactAgendaText', 'Agenda · texto', 'contacto'],
  ['contactAgendaButton', 'Agenda · botón', 'contacto'],
  ['companiesEyebrow', 'Empresas · texto superior', 'inicio'],
  ['companiesTitle', 'Empresas · título', 'inicio'],
  ['companiesText', 'Empresas · texto', 'inicio', { long: true, hint: HINT_VARS }],
  ['insurersLabel', 'Aseguradoras · etiqueta', 'inicio'],
  ['insurersButton', 'Aseguradoras · botón', 'inicio'],
  ['contactWhatsappLabel', 'WhatsApp · etiqueta', 'contacto'],
  ['formEyebrow', 'Formulario · texto superior', 'contacto'],
  ['formTitle', 'Formulario · título', 'contacto', { hint: HINT_ACCENT }],
  ['formText', 'Formulario · texto', 'contacto', { long: true }],
  ['formName', 'Formulario · campo nombre', 'contacto'],
  ['formPhone', 'Formulario · campo teléfono', 'contacto'],
  ['formEmail', 'Formulario · campo correo', 'contacto'],
  ['formBranch', 'Formulario · campo sucursal', 'contacto'],
  ['formBranchAny', 'Formulario · opción "cualquier sucursal"', 'contacto'],
  ['formReason', 'Formulario · campo motivo', 'contacto'],
  ['formReasonUnknown', 'Formulario · opción "no sé"', 'contacto'],
  ['formMessage', 'Formulario · campo mensaje', 'contacto'],
  ['formPrivacy', 'Formulario · casilla de privacidad', 'contacto', { hint: 'Lo que pongas entre *asteriscos* se convierte en el enlace al aviso de privacidad.' }],
  ['formButton', 'Formulario · botón', 'contacto'],
  ['formSending', 'Formulario · mientras se envía', 'contacto'],
  ['formSuccess', 'Formulario · mensaje de éxito', 'contacto', { long: true }],
  ['formError', 'Formulario · mensaje de error', 'contacto', { long: true }],

  ['hoursLabel', 'Etiqueta de horario', 'sucursales'],
  ['floatingWhatsapp', 'Botón flotante de WhatsApp (texto)', 'generales'],

  ['privacyTitle', 'Título', 'legal'],
  ['privacyUpdated', 'Fecha de actualización', 'legal'],
  ['privacyText', 'Texto del aviso', 'legal', { long: true, hint: 'Separa párrafos con una línea en blanco. Una línea que empiece con "## " se muestra como subtítulo. {responsable}, {domicilio} y {correo} se llenan solos con "Datos de la clínica".' }],
];

// Pre-fill the document with the current site copy the first time it is opened in the Studio.
const copyInitialValue = () => ({
  ...Object.fromEntries(COPY_FIELDS.map(([name]) => [name, localCopy[name]])),
  pillars: localCopy.pillars,
  aboutItems: localCopy.aboutItems.map((a, i) => ({ _key: `about-${i}`, _type: 'aboutItem', ...a })),
  toothLayers: localCopy.toothLayers.map(({ specialty: slug, ...l }, i) => ({
    _key: `layer-${i}`,
    _type: 'toothLayer',
    ...l,
    specialty: { _type: 'reference', _ref: `specialty-${slug}` },
  })),
});

export const siteCopy = defineType({
  name: 'siteCopy',
  title: 'Textos del sitio',
  type: 'document',
  groups: [
    { name: 'inicio', title: 'Inicio', default: true },
    { name: 'especialidades', title: 'Especialidades' },
    { name: 'sucursales', title: 'Sucursales' },
    { name: 'equipo', title: 'Equipo' },
    { name: 'contacto', title: 'Contacto' },
    { name: 'generales', title: 'Generales' },
    { name: 'legal', title: 'Aviso de privacidad' },
  ],
  initialValue: copyInitialValue,
  fields: [
    ...COPY_FIELDS.map(([name, title, group, opts]) =>
      defineField({
        name,
        title,
        group,
        type: opts?.long ? 'text' : 'string',
        ...(opts?.long ? { rows: name === 'privacyText' ? 24 : 3 } : {}),
        description: opts?.hint,
        validation: (r) => r.required(),
      }),
    ),
    defineField({
      name: 'toothLayers',
      title: 'Animación del diente · capas',
      description: 'Las 4 capas del diente, de arriba hacia abajo. Cada una enlaza a su especialidad.',
      group: 'inicio',
      type: 'array',
      validation: (r) => r.length(4),
      of: [
        defineArrayMember({
          name: 'toothLayer',
          type: 'object',
          fields: [
            defineField({ name: 'layer', title: 'Capa', type: 'string', description: 'Ej. "01 · Esmalte".', validation: (r) => r.required() }),
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Descripción (computadora)', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'short', title: 'Descripción corta (celular)', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'specialty', title: 'Enlaza a', type: 'reference', to: [{ type: 'specialty' }], validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'name', subtitle: 'layer' } },
        }),
      ],
    }),
    defineField({
      name: 'pillars',
      title: 'Tres frases bajo la portada',
      group: 'inicio',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (r) => r.length(3),
    }),
    defineField({
      name: 'aboutItems',
      title: 'Nosotros · tres columnas',
      group: 'inicio',
      type: 'array',
      validation: (r) => r.length(3),
      of: [
        defineArrayMember({
          name: 'aboutItem',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'text', title: 'Texto', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Textos del sitio' }) },
});

export const schemaTypes = [siteSettings, siteCopy, specialty, branch, doctor, insurer, faq];
