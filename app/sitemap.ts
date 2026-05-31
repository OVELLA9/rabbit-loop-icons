import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             'https://icons.rabbit-loop.com',
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
  ]
}
