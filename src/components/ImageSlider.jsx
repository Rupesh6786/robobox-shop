import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const url = import.meta.env.VITE_BACKEND_URL;

function ImageSlider() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch(`${url}api/advertimages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setImages(data);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                }
            }
        ]
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 w-screen">
            <Slider {...sliderSettings}>
                {images.map((image, index) => (
                    <div key={image.id}>
                        <LazyLoadImage 
                            src={`${url.replace(/\/+$/, '')}${image.url}`} 
                            alt={`Slide ${index + 1}`} 
                            className="w-screen h-auto object-cover"
                            sizes="(max-width: 800px) 100vw, 800px"
                            effect="blur"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ImageSlider;