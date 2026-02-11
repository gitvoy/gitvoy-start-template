import type { AstroGlobal } from 'astro'
import fs from 'node:fs'
import path from 'node:path'

export interface GitvoyConfig {
  version: number
  theme: string
  site: {
    title: string
    description?: string
    author?: string
    social?: {
      twitter?: string
      github?: string
    }
  }
  customTheme?: ThemeConfig
}

export interface ThemeConfig {
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    foreground?: string
    muted?: string
    mutedForeground?: string
    border?: string
  }
  fonts?: {
    sans?: string
    serif?: string
    mono?: string
  }
  radius?: string
}

// 내장 테마 정의
export const builtInThemes: Record<string, ThemeConfig> = {
  minimal: {
    colors: {
      primary: '#0070f3',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f3f4f6',
      mutedForeground: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, monospace',
    },
    radius: '0.5rem',
  },
  'minimal-dark': {
    colors: {
      primary: '#3b82f6',
      secondary: '#9ca3af',
      accent: '#f59e0b',
      background: '#0f172a',
      foreground: '#f1f5f9',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
    },
    fonts: {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, monospace',
    },
    radius: '0.5rem',
  },
  serif: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#ec4899',
      background: '#faf5ff',
      foreground: '#1e1b4b',
      muted: '#f3e8ff',
      mutedForeground: '#6b21a8',
      border: '#e9d5ff',
    },
    fonts: {
      sans: 'system-ui, sans-serif',
      serif: 'Merriweather, Georgia, serif',
      mono: 'Fira Code, monospace',
    },
    radius: '0.25rem',
  },
  brutalist: {
    colors: {
      primary: '#000000',
      secondary: '#525252',
      accent: '#ef4444',
      background: '#ffffff',
      foreground: '#000000',
      muted: '#fafafa',
      mutedForeground: '#525252',
      border: '#000000',
    },
    fonts: {
      sans: 'Arial, Helvetica, sans-serif',
      serif: 'Times New Roman, serif',
      mono: 'Courier, monospace',
    },
    radius: '0',
  },
}

let cachedConfig: GitvoyConfig | null = null

export function getConfig(): GitvoyConfig {
  if (cachedConfig) return cachedConfig

  try {
    const configPath = path.resolve(process.cwd(), 'gitvoy.config.json')
    const content = fs.readFileSync(configPath, 'utf-8')
    cachedConfig = JSON.parse(content)
    return cachedConfig!
  } catch {
    // 기본 설정 반환
    return {
      version: 1,
      theme: 'minimal',
      site: {
        title: 'My Blog',
        description: 'Welcome to my blog',
      },
    }
  }
}

export function getThemeConfig(): ThemeConfig {
  const config = getConfig()

  // 커스텀 테마가 있으면 사용
  if (config.customTheme) {
    return config.customTheme
  }

  // 테마 이름에서 내장 테마 찾기
  const themeName = config.theme.replace('@gitvoy/theme-', '')
  return builtInThemes[themeName] || builtInThemes.minimal
}

export function generateThemeCSS(): string {
  const theme = getThemeConfig()

  const cssVars: string[] = []

  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (value) {
        cssVars.push(`--color-${key}: ${value};`)
      }
    })
  }

  if (theme.fonts) {
    Object.entries(theme.fonts).forEach(([key, value]) => {
      if (value) {
        cssVars.push(`--font-${key}: ${value};`)
      }
    })
  }

  if (theme.radius) {
    cssVars.push(`--radius: ${theme.radius};`)
  }

  return `:root {\n  ${cssVars.join('\n  ')}\n}`
}
