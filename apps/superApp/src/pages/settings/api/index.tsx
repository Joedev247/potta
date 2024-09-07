import React from 'react'
import API from 'apps/superApp/src/modules/settings/components/api'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'

const ApiPage: React.FC = () => {
  return (
    <SettingsLayout>
      <API />
    </SettingsLayout>
  )
}

export default ApiPage