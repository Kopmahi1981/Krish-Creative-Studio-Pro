import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, CreditCard, LogOut, LifeBuoy } from 'lucide-react'
import { Dropdown, Modal, Button, useToast } from '@/components/ui'

/**
 * User profile dropdown. Navigates to placeholder pages on selection.
 * "Sign out" opens a confirmation modal only — no authentication is performed.
 */
export function UserProfileMenu() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [signOutOpen, setSignOutOpen] = useState(false)

  const handleSelect = (value: string) => {
    switch (value) {
      case 'profile':
        navigate('/profile')
        break
      case 'billing':
        navigate('/billing')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'support':
        navigate('/support')
        break
      case 'signout':
        setSignOutOpen(true)
        break
    }
  }

  return (
    <>
      <Dropdown
        trigger={
          <span className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-brand-rose to-brand-purple text-sm font-bold text-white shadow-neon-rose transition hover:brightness-110">
            KM
          </span>
        }
        options={[
          { label: 'Profile', value: 'profile', icon: <User className="h-4 w-4" /> },
          { label: 'Billing', value: 'billing', icon: <CreditCard className="h-4 w-4" /> },
          { label: 'Settings', value: 'settings', icon: <Settings className="h-4 w-4" /> },
          { label: 'Support', value: 'support', icon: <LifeBuoy className="h-4 w-4" /> },
          { label: 'Sign out', value: 'signout', icon: <LogOut className="h-4 w-4" /> },
        ]}
        align="end"
        onSelect={handleSelect}
      />

      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setSignOutOpen(false)
                toast('Sign out is disabled in this demo.', 'info')
              }}
            >
              Sign out
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground-secondary">
          You would be returned to the login screen. This is a demo — no authentication is performed.
        </p>
      </Modal>
    </>
  )
}
