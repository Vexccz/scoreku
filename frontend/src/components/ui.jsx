import { Shield } from 'lucide-react'

// Shared brand mark used across all pages
export function BrandMark({ size = 28 }) {
  return (
    <div
      className="relative rounded-[10px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(16,185,129,0.5)]"
      style={{ width: size, height: size }}
    >
      <Shield size={Math.round(size * 0.55)} className="text-black" strokeWidth={2.5} />
    </div>
  )
}

// Atmospheric page background with emerald glow orbs and grid overlay
export function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[140px]" />
    </div>
  )
}

// Shell wrapper for every page — ensures black bg + antialiasing + relative positioning
export function PageShell({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen bg-black text-white antialiased ${className}`}>
      <PageBackground />
      {children}
    </div>
  )
}

// Section heading with eyebrow label and descriptive subtitle
export function SectionHeading({ eyebrow, title, desc, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-2xl ${alignment} mb-12`}>
      {eyebrow && (
        <div className="text-[11px] tracking-[0.3em] uppercase text-emerald-400 font-medium mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.05]">
        {title}
      </h2>
      {desc && <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed">{desc}</p>}
    </div>
  )
}

// Standard surface card — used as content container
export function Card({ children, className = '', hover = false }) {
  const hoverClass = hover ? 'hover:border-emerald-500/30 transition-colors' : ''
  return (
    <div className={`bg-[#0a0a0a] border border-white/[0.06] rounded-2xl ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}

// Elevated card (for primary CTAs and highlighted content)
export function HighlightCard({ children, className = '' }) {
  return (
    <div
      className={`relative bg-gradient-to-br from-emerald-500/10 via-[#0a0a0a] to-[#0a0a0a] border border-emerald-500/30 rounded-2xl shadow-[0_40px_80px_-40px_rgba(16,185,129,0.3)] ${className}`}
    >
      {children}
    </div>
  )
}

// Eyebrow/Pill label
export function Pill({ children, icon: Icon, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </div>
  )
}

// Shared button class strings — compose via className
export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors',
  secondary:
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-white/80 border border-white/15 hover:border-white/30 hover:text-white rounded-full font-medium transition-colors',
  ghost:
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors',
  emerald:
    'inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-full font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-colors shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)]',
}

// Shared input styling
export const input = {
  base:
    'w-full px-4 py-3 bg-[#0a0a0a] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all',
  label: 'block text-xs font-medium text-white/60 mb-2 tracking-wide uppercase',
}
