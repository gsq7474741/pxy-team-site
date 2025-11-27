import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PXY Team Site 开发文档',
  description: '彭教授团队网站开发文档 - 设计、实现、部署指南',
  lang: 'zh-CN',
  
  // GitHub Pages 配置
  base: '/pxy-team-site/',
  
  // 忽略 localhost 链接检查
  ignoreDeadLinks: [
    /^http:\/\/localhost/,
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '架构设计', link: '/architecture/overview' },
      { text: '前端', link: '/frontend/overview' },
      { text: '后端', link: '/backend/overview' },
      { text: '部署', link: '/deployment/overview' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目概述', link: '/guide/project-overview' },
            { text: '技术栈', link: '/guide/tech-stack' },
            { text: '目录结构', link: '/guide/directory-structure' }
          ]
        }
      ],
      '/architecture/': [
        {
          text: '架构设计',
          items: [
            { text: '系统架构概述', link: '/architecture/overview' },
            { text: 'Monorepo 结构', link: '/architecture/monorepo' },
            { text: '数据流设计', link: '/architecture/data-flow' },
            { text: '国际化设计', link: '/architecture/i18n' }
          ]
        }
      ],
      '/frontend/': [
        {
          text: '前端开发',
          items: [
            { text: '概述', link: '/frontend/overview' },
            { text: '路由与页面', link: '/frontend/pages' },
            { text: '组件设计', link: '/frontend/components' },
            { text: 'Strapi 客户端', link: '/frontend/strapi-client' },
            { text: '数据转换层', link: '/frontend/transformers' },
            { text: '类型定义', link: '/frontend/types' },
            { text: '国际化实现', link: '/frontend/i18n' },
            { text: '样式系统', link: '/frontend/styling' }
          ]
        }
      ],
      '/backend/': [
        {
          text: '后端开发',
          items: [
            { text: '概述', link: '/backend/overview' },
            { text: 'Strapi 配置', link: '/backend/strapi-config' },
            { text: '内容类型定义', link: '/backend/content-types' },
            { text: 'API 设计', link: '/backend/api-design' },
            { text: '媒体存储（OSS）', link: '/backend/media-storage' },
            { text: '数据库配置', link: '/backend/database' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署指南',
          items: [
            { text: '概述', link: '/deployment/overview' },
            { text: '环境变量配置', link: '/deployment/environment' },
            { text: 'GitHub Actions CI/CD', link: '/deployment/github-actions' },
            { text: '本地开发', link: '/deployment/local-dev' },
            { text: '常见问题', link: '/deployment/faq' }
          ]
        },
        {
          text: '阿里云基础设施',
          items: [
            { text: '基础设施总览', link: '/deployment/aliyun-infrastructure' },
            { text: 'ICP 备案', link: '/deployment/aliyun-icp' },
            { text: 'DNS 与 SSL 证书', link: '/deployment/aliyun-dns-ssl' },
            { text: '函数计算 FC', link: '/deployment/aliyun-fc' },
            { text: '对象存储 OSS', link: '/deployment/aliyun-oss' },
            { text: '云数据库 RDS', link: '/deployment/aliyun-rds' },
            { text: 'CDN 加速', link: '/deployment/aliyun-cdn' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/pxy-team-site' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'PXY Team Site 开发文档',
      copyright: 'Copyright © 2024'
    },
    
    outline: {
      level: [2, 3],
      label: '页面导航'
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})
