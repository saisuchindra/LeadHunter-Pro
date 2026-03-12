import clsx from 'clsx'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('glass-card p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
