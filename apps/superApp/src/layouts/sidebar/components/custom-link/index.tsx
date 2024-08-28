import React from 'react'
import Link from 'next/link'

type Props = {
  label: string
  href: string
}

const CustomLink: React.FC<Props> = ({ label, href }) => {
  return (
    <div className='hover:bg-green-50 hover:text-green-500 p-2'>
      <Link className="capitalize" href={href}>{label}</Link>
    </div>
  )
}

export default CustomLink