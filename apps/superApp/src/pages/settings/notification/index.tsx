import React from 'react'
import SettingsLayout from 'apps/superApp/src/modules/settings/layout/setting-layout'
import Notification from 'apps/superApp/src/modules/settings/components/notification'

const NotificationPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Notification />
    </SettingsLayout>
  )
}

export default NotificationPage