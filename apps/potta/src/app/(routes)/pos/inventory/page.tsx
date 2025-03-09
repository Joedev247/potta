import React from 'react';
import RootLayout from '../../layout';
import App from './components/tabelComponent';
import Filter from './components/filters';



const Files = () => {
  return (
    <RootLayout>

      <div className="pl-16 pr-5 w-full mt-10">
        <Filter />
        <App />
      </div>
    </RootLayout>
  );
};
export default Files;
