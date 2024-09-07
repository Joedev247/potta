import React, { FC } from 'react'

type Props = {
  status: string
}

const MemberChip: FC<Props> = ({ status }) => {
  const statuses = {
    active: "bg-[#52C41A]",
    paused: "bg-red-500",
    inactive: "inactive"
  }

  return (
    <span
      className={`${status === "active"
        ? "text-black"
        : " text-white"
        } ${statuses[status as keyof typeof statuses]} 
        px-3 py-0.5 max-w-fit rounded-full capitalize`
      }>
      {status}
    </span>
  )
}

export default MemberChip