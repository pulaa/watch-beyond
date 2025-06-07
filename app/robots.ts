import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/api/', '/admin/', '/_next/', '/node_modules/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/private/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://watchbeyond.live/sitemap.xml',
    host: 'https://watchbeyond.live',
  }
} 