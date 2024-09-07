import React from 'react'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'
import Security from 'apps/superApp/src/modules/settings/components/security'

const SecurityPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Security />
    </SettingsLayout>
  )
}

export default SecurityPage