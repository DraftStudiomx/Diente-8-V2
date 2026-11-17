// Called by the Studio's Presentation tool: validates the secret it sends, then turns on draft mode.
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { previewClient } from '@/lib/content';

export const { GET } = defineEnableDraftMode({ client: previewClient });
