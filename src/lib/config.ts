import configJson from '../../gitvoy.config.json';

interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    mutedForeground?: string;
    border?: string;
  };
  fonts?: {
    sans?: string;
    serif?: string;
    mono?: string;
  };
  radius?: string;
}

const builtinThemes: Record<string, ThemeConfig> = {
  minimal: {
    colors: {
      primary: '#0070f3',
      secondary: '#6b7280',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f3f4f6',
      mutedForeground: '#6b7280',
      border: '#e5e7eb',
    },
    fonts: { sans: 'system-ui, -apple-system, sans-serif', serif: 'Georgia, serif', mono: 'Menlo, monospace' },
    radius: '0.5rem',
  },
  'minimal-dark': {
    colors: {
      primary: '#3b82f6',
      secondary: '#9ca3af',
      background: '#0f172a',
      foreground: '#e2e8f0',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      border: '#334155',
    },
    fonts: { sans: 'system-ui, -apple-system, sans-serif', serif: 'Georgia, serif', mono: 'Menlo, monospace' },
    radius: '0.5rem',
  },
  serif: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#faf5ff',
      foreground: '#1e1b4b',
      muted: '#f5f3ff',
      mutedForeground: '#6b7280',
      border: '#e9d5ff',
    },
    fonts: { sans: 'Merriweather, Georgia, serif', serif: 'Merriweather, Georgia, serif', mono: 'Menlo, monospace' },
    radius: '0.25rem',
  },
  brutalist: {
    colors: {
      primary: '#000000',
      secondary: '#333333',
      background: '#ffffff',
      foreground: '#000000',
      muted: '#f5f5f5',
      mutedForeground: '#666666',
      border: '#000000',
    },
    fonts: { sans: 'Arial, Helvetica, sans-serif', serif: 'Georgia, serif', mono: 'Courier New, monospace' },
    radius: '0',
  },
};

export function getConfig() {
  return configJson;
}

export function getTheme(): ThemeConfig {
  const themeName = configJson.theme || 'minimal';
  return builtinThemes[themeName] || builtinThemes['minimal'];
}

export function generateThemeCSS(): string {
  const theme = getTheme();
  const vars: string[] = [];

  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      vars.push(`  --color-${key}: ${value};`);
    }
  }
  if (theme.fonts) {
    for (const [key, value] of Object.entries(theme.fonts)) {
      vars.push(`  --font-${key}: ${value};`);
    }
  }
  if (theme.radius !== undefined) {
    vars.push(`  --radius: ${theme.radius};`);
  }

  return `:root {\n${vars.join('\n')}\n}`;
}
