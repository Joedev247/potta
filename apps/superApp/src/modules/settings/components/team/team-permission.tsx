import React, { useState } from 'react'

const TeamPermission = () => {
	const [name, setName] = useState('talk')

	return (
		<div className='w-full my-5'>
			<div className='w-full flex'>
				<div onClick={() => setName('talk')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'talk' ? 'primary' : ''}`}>
					<div className='flex space-x-3'>
						<img src="/icons/talk.svg" alt="" />
						<div>
							<p>Talk</p>
						</div>
					</div>
				</div>
				<div onClick={() => setName('ads')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'ads' ? 'primary' : ''}`}>
					<div className='flex space-x-3'>
						<img src="/icons/instanvi.svg" alt="" />
						<div>
							<p>Ads</p>
						</div>
					</div>
				</div>
				<div onClick={() => setName('potta')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'potta' ? 'primary' : ''}`}>
					<div className='flex space-x-3'>
						<img src="/icons/potta.svg" alt="" />
						<div>
							<p>Potta</p>
						</div>
					</div>
				</div>
				<div onClick={() => setName('tribu')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'tribu' ? 'primary' : ''}`}>
					<div className='flex space-x-3'>
						<img src="/icons/tribu.svg" alt="" />
						<div>
							<p>Tribu</p>
						</div>
					</div>
				</div>
			</div>
			{
				name == 'potta' ? <></> :
					name == 'tribu' ? <></> :
						name == 'ads' ? <></> :
							<></>
			}
		</div>
	)
}
export default TeamPermission