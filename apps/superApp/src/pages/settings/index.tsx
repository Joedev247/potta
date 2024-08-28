import React, { useContext } from 'react'
import Layout from '../../layouts'
import API from '../../modules/settings/components/api'
import Log from '../../modules/settings/components/logs'
import Tabs from '../../modules/settings/components/tabs'
import Team from '../../modules/settings/components/team'
import Apps from '../../modules/settings/components/apps'
import Billing from '../../modules/settings/components/billing'
import General from '../../modules/settings/components/general'
import { ContextData } from '../../contexts/verificationContext'
import Security from '../../modules/settings/components/security'
import Notification from '../../modules/settings/components/notification'

const Settings = () => {
	const context = useContext(ContextData)

	return (
		<Layout>
			<div className='flex w-full min-h-[93.5vh]'>
				<div className='w-[10%] border-r'>
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
		</Layout>
	)
}
export default Settings