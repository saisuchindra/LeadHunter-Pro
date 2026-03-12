import clsx from 'clsx'

const badgeStyles = {
  'NO WEBSITE': 'bg-coral/15 text-coral',
  'WEAK SEO': 'bg-yellow-400/15 text-yellow-400',
  'NO GMB': 'bg-orange-400/15 text-orange-400',
  'NO SOCIAL': 'bg-violet/15 text-violet',
  'FEW REVIEWS': 'bg-yellow-400/15 text-yellow-400',
  'WEBSITE DOWN': 'bg-coral/15 text-coral',
  'HOT LEAD': 'bg-mint/15 text-mint',
  'WARM': 'bg-yellow-400/15 text-yellow-400',
  'WEAK': 'bg-[#5A5A7A]/15 text-[#5A5A7A]',
  // Status badges
  new: 'bg-violet/15 text-violet',
  contacted: 'bg-blue-400/15 text-blue-400',
  replied: 'bg-mint/15 text-mint',
  meeting: 'bg-yellow-400/15 text-yellow-400',
  client: 'bg-green-400/15 text-green-400',
  lost: 'bg-coral/15 text-coral',
}

export default function Badge({ label, pulse, className }) {
  const style = badgeStyles[label] || 'bg-white/10 text-[#E8E8F0]'

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono',
        style,
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {label}
    </span>
  )
}
