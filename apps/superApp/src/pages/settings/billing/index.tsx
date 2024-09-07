import React from 'react'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'
import Billing from 'apps/superApp/src/modules/settings/components/billing'

const BillingPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Billing />
    </SettingsLayout>
  )
}

export default BillingPage