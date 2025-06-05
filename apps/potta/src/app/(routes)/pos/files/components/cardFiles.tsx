import React from 'react';
import Image from 'next/image';

const CardFile = () => {
  const data = [
    {
      id: 1,
      name: 'Invoice 1',
      char: 'folder',
    },
    {
      id: 2,
      name: 'Invoice 2',
      char: 'folder',
    },
    {
      id: 3,
      name: 'Invoice 3',
      char: 'userfolder',
    },
    {
      id: 4,
      name: 'Invoice 1',
      char: 'folder',
    },
    {
      id: 5,
      name: 'Invoice 2',
      char: 'folder',
    },
    {
      id: 6,
      name: 'Invoice 3',
      char: 'userfolder',
    },
    {
      id: 7,
      name: 'Invoice 1',
      char: 'folder',
    },
    {
      id: 8,
      name: 'Invoice 2',
      char: 'folder',
    },
    {
      id: 9,
      name: 'Invoice 3',
      char: 'userfolder',
    },
    // Add more data as needed
  ];

  const Items = [
    {
      id: 1,
      name: 'Invoice 1',
      url: '/icons/shoes.svg',
    },
    {
      id: 2,
      name: 'Invoice 2',
      url: '/icons/shoes.svg',
    },
    {
      id: 3,
      name: 'Invoice 3',
      url: '/icons/shoes.svg',
    },
  ];

  return (
    <div className="px-4">
      <div className="grid grid-cols-6 gap-8">
        {data.map((item) => {
          if (item.char === 'folder')
            return (
              <div
                key={item.id}
                className="w-full h-36 flex justify-center relative items-center border"
              >
                <Image
                  src="/icons/folder.svg"
                  alt="Folder icon"
                  width={48}
                  height={48}
                  className="-mt-2"
                />
                <p className="absolute bottom-2 left-1/3 ml-2">{item.name}</p>
              </div>
            );
          if (item.char === 'userfolder')
            return (
              <div
                key={item.id}
                className="w-full h-36 flex justify-center relative items-center border"
              >
                <Image
                  src="/icons/userfolder.svg"
                  alt="User folder icon"
                  width={48}
                  height={48}
                  className="-mt-2"
                />
                <p className="absolute bottom-2 left-1/3 ml-2 ">{item.name}</p>
              </div>
            );
        })}
      </div>
      <div className="grid mt-9 grid-cols-6 gap-8">
        {Items.map((item) => {
          return (
            <div
              key={item.id}
              className="w-full h-36 flex justify-center relative items-center border"
            >
              <Image
                src={item.url}
                alt={`${item.name} icon`}
                width={96}
                height={96}
                className="-mt-2 h-24 w-auto"
              />
              <p className="absolute bottom-2 left-1/3 ml-2 ">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardFile;
