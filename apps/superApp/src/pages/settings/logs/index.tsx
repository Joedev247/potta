import React from 'react'
import Log from 'apps/superApp/src/modules/settings/components/logs'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'

const LogPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Log />
    </SettingsLayout>
  )
}

export default LogPage