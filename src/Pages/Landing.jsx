import React from 'react'
import Slider from '../components/ImageSlider'
import Displayproducts from '../components/Displayproducts'

function Landing() {
  return (<>
<div className='overflow-x-hidden min-h-screen'>

   <Slider/>

   <Displayproducts/>
   </div>
   </>
  )
}

export default Landing