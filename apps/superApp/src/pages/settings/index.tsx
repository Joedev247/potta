import React, { useContext } from 'react'
import Tabs from '../../modules/settings/components/tabs'
import API from '../../modules/settings/components/api'
import Log from '../../modules/settings/components/logs'
import Team from '../../modules/settings/components/team'
import Apps from '../../modules/settings/components/apps'
import { ContextData } from '../../contexts/verificationContext'
import Billing from '../../modules/settings/components/billing'
import General from '../../modules/settings/components/general'
import Security from '../../modules/settings/components/security'
import Notification from '../../modules/settings/components/notification'

const Settings = () => {
	const context = useContext(ContextData)
	return (
		<div className='flex w-full h-[94vh]'>
			<div className='w-[10%] h-[95.7vh] fixed'>
				<Tabs />
			</div>
			<div className='w-[90%] ml-[10%]'>
				{
					context?.toggle == 'team' ?
						<Team /> :
						context?.toggle == 'security' ? <Security />
							: context?.toggle == 'API' ? <API />
								: context?.toggle == 'notification' ? <Notification /> :
									context?.toggle == 'logs' ? <Log /> :
										context?.toggle == 'billing' ? <Billing /> :
											context?.toggle == 'apps' ? <Apps /> :
												<General />
				}
			</div>
		</div>
	)
}
export default Settings