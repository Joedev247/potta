import Slider from '@potta/components/slideover';
import React, { useState } from 'react';

const SliderCard = () => {
  return (
    <Slider edit={false} title={'New Card'} buttonText="card">
      hey
    </Slider>
  );
};

export default SliderCard;
