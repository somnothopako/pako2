import { Card } from '@/app/components/ui/card';
import { Logo } from '@/app/components/Logo';

/**
 * ThemeShowcase Component
 * 
 * This component demonstrates the PAKO color system and design tokens.
 * Use this as a reference for the application's visual design language.
 * 
 * Color System:
 * - Primary (Teal): #4FD1C5 - Calm, trustworthy, financial security
 * - Secondary (Gold): #F6C94D - Optimistic, rewarding, achievement
 * - Accent (Coral): #FC8181 - Friendly, encouraging, supportive
 * - Navy: #1E3A44 - Professional, stable (from logo)
 */

export function ThemeShowcase() {
  const colorGroups = [
    {
      name: 'Primary - Teal',
      description: 'Main brand color for trust and calm',
      colors: [
        { name: 'Teal Light', value: '#81E6D9', var: '--pako-teal-light' },
        { name: 'Teal', value: '#4FD1C5', var: '--pako-teal' },
        { name: 'Teal Dark', value: '#38B2AC', var: '--pako-teal-dark' },
      ],
    },
    {
      name: 'Secondary - Gold',
      description: 'Warm and rewarding accents',
      colors: [
        { name: 'Gold Light', value: '#FAF089', var: '--pako-gold-light' },
        { name: 'Gold', value: '#F6C94D', var: '--pako-gold' },
        { name: 'Gold Dark', value: '#D69E2E', var: '--pako-gold-dark' },
      ],
    },
    {
      name: 'Accent - Coral',
      description: 'Friendly and supportive highlights',
      colors: [
        { name: 'Coral Light', value: '#FEB2B2', var: '--pako-coral-light' },
        { name: 'Coral', value: '#FC8181', var: '--pako-coral' },
        { name: 'Coral Dark', value: '#E53E3E', var: '--pako-coral-dark' },
      ],
    },
    {
      name: 'Navy - Professional',
      description: 'From logo - stability and trust',
      colors: [
        { name: 'Navy Light', value: '#2E4A54', var: '--pako-navy-light' },
        { name: 'Navy', value: '#1E3A44', var: '--pako-navy' },
        { name: 'Navy Dark', value: '#152B33', var: '--pako-navy-dark' },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-background">
      {/* Logo Section */}
      <div className="text-center space-y-4">
        <Logo size="xl" className="mx-auto" />
        <h1 className="text-3xl font-bold">PAKO Design System</h1>
        <p className="text-muted-foreground italic">Blow bubbles, not your budget</p>
      </div>

      {/* Color Palette */}
      <div className="space-y-6">
        {colorGroups.map((group) => (
          <Card key={group.name} className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {group.colors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className="h-20 rounded-lg border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="text-sm">
                    <p className="font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.value}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color.var}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Design Principles */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Design Principles</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Safe, friendly, and non-judgmental tone</li>
          <li>✓ No financial shaming or fear-based messaging</li>
          <li>✓ Mobile-first with full responsive support</li>
          <li>✓ Clear visual hierarchy and generous spacing</li>
          <li>✓ Consistent use of rounded corners (0.75rem)</li>
          <li>✓ Light and dark themes with PAKO navy as dark base</li>
        </ul>
      </Card>
    </div>
  );
}
