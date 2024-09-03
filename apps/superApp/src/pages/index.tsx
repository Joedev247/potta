import React from 'react'
import Layout from '../layouts/index'
import AppCard from '../components/app-card'


const applications = [
  {
    title: 'Talk',
    image: '/icons/talk.svg',
  },
  {
    title: 'Tribu',
    image: '/icons/Tribu.svg',
  },
  {
    title: 'Instanvi',
    image: '/icons/instanvi.svg',
  },
  {
    title: 'Potta',
    image: '/icons/Potta.svg',
  },
  {
    title: 'Flows',
    image: '/icons/flows.svg',
  },
]

const HomeApp = () => {
  return (
    <Layout>
      <div className='mx-auto flex max-w-7xl items-center justify-between p-8 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-5 w-full'>
          {applications?.map((app, i) => (
            <AppCard key={i} title={app.title} image={app.image} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default HomeApp
