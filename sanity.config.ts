'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';

// Single documents: one fixed ID each, never created from the "+" menu, never deleted or duplicated.
const SINGLETONS = new Set(['siteSettings', 'siteCopy']);

export default defineConfig({
  name: 'diente8',
  title: 'Diente8',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    // Hidden from "create new" (the templates stay, so their initial values pre-fill the document).
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((item) => !SINGLETONS.has(item.templateId)) : prev,
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType) ? actions.filter((a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action)) : actions,
  },
  plugins: [
    structureTool({
      title: 'Contenido',
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem().title('Textos del sitio').id('siteCopy').child(S.document().schemaType('siteCopy').documentId('siteCopy')),
            S.listItem().title('Datos de la clínica').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('specialty').title('Especialidades'),
            S.documentTypeListItem('doctor').title('Especialistas'),
            S.documentTypeListItem('branch').title('Sucursales'),
            S.documentTypeListItem('insurer').title('Aseguradoras'),
            S.documentTypeListItem('faq').title('Preguntas frecuentes'),
          ]),
    }),
    // Live preview of the site inside the Studio: click any text to open its field.
    presentationTool({
      title: 'Vista previa',
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable', disable: '/api/draft-mode/disable' } },
      resolve: {
        mainDocuments: [{ route: '/especialidades/:slug', filter: `_type == "specialty" && slug.current == $slug` }],
        locations: {
          siteSettings: defineLocations({ locations: [{ title: 'Inicio', href: '/' }, { title: 'Contacto', href: '/contacto' }] }),
          siteCopy: defineLocations({
            locations: [
              { title: 'Inicio', href: '/' },
              { title: 'Especialidades', href: '/especialidades' },
              { title: 'Sucursales', href: '/sucursales' },
              { title: 'Equipo', href: '/equipo' },
              { title: 'Contacto', href: '/contacto' },
            ],
          }),
          specialty: defineLocations({
            select: { title: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{ title: doc.title ?? 'Especialidad', href: `/especialidades/${doc.slug}` }] : []),
                { title: 'Especialidades', href: '/especialidades' },
              ],
            }),
          }),
          doctor: defineLocations({ locations: [{ title: 'Equipo', href: '/equipo' }, { title: 'Inicio', href: '/' }] }),
          branch: defineLocations({ locations: [{ title: 'Sucursales', href: '/sucursales' }, { title: 'Contacto', href: '/contacto' }] }),
          insurer: defineLocations({ locations: [{ title: 'Contacto', href: '/contacto' }] }),
          faq: defineLocations({ locations: [{ title: 'Inicio', href: '/' }] }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
