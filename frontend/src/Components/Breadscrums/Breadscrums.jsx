import React from 'react'
import './Breadscrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadscrums = (props) => {
    const {product} = props;
  return (
    <div className='breadscrum'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}

export default Breadscrums
