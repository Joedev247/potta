import React from 'react'

const CardFile = () => {
    const data = [
        {
            id: 1,
            name: 'Invoice 1',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 2',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 3',
            char: "userfolder"
        },
        {
            id: 1,
            name: 'Invoice 1',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 2',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 3',
            char: "userfolder"
        },
        {
            id: 1,
            name: 'Invoice 1',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 2',
            char: "folder"
        },
        {
            id: 1,
            name: 'Invoice 3',
            char: "userfolder"
        },
        // Add more data as needed
    ]

    const Items = [
        {
            id: 1,
            name: 'Invoice 1',
            url: "/icons/shoes.svg"
        },
        {
            id: 1,
            name: 'Invoice 2',
            url: "/icons/shoes.svg"
        },
        {
            id: 1,
            name: 'Invoice 3',
            url: "/icons/shoes.svg"
        },
    ]

    return (
        <div className='px-4'>
            <div className="grid grid-cols-6 gap-8" >
                {data.map((item: any, id: number) => {
                    if (item.char === "folder")
                        return (
                            <div className='w-full h-36 flex justify-center relative items-center border'>
                                <img src="/icons/folder.svg" alt="" className='-mt-2' />
                                <p className='absolute bottom-2 left-1/3 ml-2'>{item.name}</p>
                            </div>
                        )
                    if (item.char === "userfolder")
                        return (
                            <div className='w-full h-36 flex justify-center relative items-center border'>
                                <img src="/icons/userfolder.svg" alt="" className='-mt-2' />
                                <p className='absolute bottom-2 left-1/3 ml-2 '>{item.name}</p>
                            </div>
                        )

                })}
            </div>
            <div className='grid mt-9 grid-cols-6 gap-8'>
                {Items.map((item: any, id: number) => {
                    return (
                        <div className='w-full h-36 flex justify-center relative items-center border'>
                            <img src={item.url} alt="" className='-mt-2 h-24 w-auto' />
                            <p className='absolute bottom-2 left-1/3 ml-2 '>{item.name}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CardFile