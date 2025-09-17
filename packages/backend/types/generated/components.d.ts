import type { Schema, Struct } from '@strapi/strapi';

export interface ContentHighlight extends Struct.ComponentSchema {
  collectionName: 'components_content_highlights';
  info: {
    description: '\u7814\u7A76\u4EAE\u70B9\u7EC4\u4EF6';
    displayName: 'Highlight';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'\u2728'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.highlight': ContentHighlight;
    }
  }
}
