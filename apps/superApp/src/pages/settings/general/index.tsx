import React from 'react'
import General from 'apps/superApp/src/modules/settings/components/general'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'

const GeneralPage: React.FC = () => {
  return (
    <SettingsLayout>
      <General />
    </SettingsLayout>
  )
}

export default GeneralPage