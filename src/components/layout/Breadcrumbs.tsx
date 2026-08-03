import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, House } from 'lucide-react'
import { resolveBreadcrumbs } from '@/features/navigation/breadcrumbs'

interface BreadcrumbsProps {
  pathname: string
}

/**
 * Route-aware breadcrumb trail. Derived from the config-driven nav model via
 * `resolveBreadcrumbs`. Includes a home root for clarity.
 */
export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const trail = resolveBreadcrumbs(pathname)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-foreground-muted">
      <Link to="/" className="flex items-center gap-1 transition hover:text-brand-cyan">
        <House className="h-3.5 w-3.5" />
      </Link>
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1
        return (
          <Fragment key={`${crumb.path}-${crumb.label}`}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            {isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : crumb.path === '#' ? (
              <span className="text-foreground-muted">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="transition hover:text-brand-cyan">
                {crumb.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
