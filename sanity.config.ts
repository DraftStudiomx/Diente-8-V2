'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';

const SINGLETON = 'siteSettings';

export default defineConfig({
  name: 'diente8',
  title: 'Diente8',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // The clinic settings are a single document: hide it from "create new".
    templates: (templates) => templates.filter((t) => t.schemaType !== SINGLETON),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === SINGLETON ? actions.filter((a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action)) : actions,
  },
  plugins: [
    structureTool({
      title: 'Contenido',
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem().title('Datos de la clínica').id(SINGLETON).child(S.document().schemaType(SINGLETON).documentId(SINGLETON)),
            S.divider(),
            S.documentTypeListItem('specialty').title('Especialidades'),
            S.documentTypeListItem('doctor').title('Especialistas'),
            S.documentTypeListItem('branch').title('Sucursales'),
            S.documentTypeListItem('insurer').title('Aseguradoras'),
            S.documentTypeListItem('faq').title('Preguntas frecuentes'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
