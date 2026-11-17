import { defineArrayMember, defineField, defineType } from 'sanity';

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
    defineField({ name: 'mapUrl', title: 'Enlace de Google Maps', type: 'url' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
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
    defineField({ name: 'answer', title: 'Respuesta', type: 'text', rows: 4, validation: (r) => r.required() }),
    orderField,
  ],
  preview: { select: { title: 'question' } },
});

export const schemaTypes = [siteSettings, specialty, branch, doctor, insurer, faq];
