import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionProps } from '../../utils/interface';
import './testimonials.scss';
import TestimonialVideo from './testimonial-video';

const Testimonials = ({ sectionRef, sectionId }: SectionProps) => {
  const { t } = useTranslation();
  const testimonials = [
    {
      key: 'testimonial-1',
      caption: t('testimonial-1-caption'),
      video: '/videos/testimonial1.mp4',
      poster: '/images/testimonial-posters/testimonial1-poster.png',
    },
    {
      key: 'testimonial-2',
      caption: t('testimonial-2-caption'),
      video: '/videos/testimonial2.mp4',
      poster: '/images/testimonial-posters/testimonial2-poster.png',
    },
    {
      key: 'testimonial-3',
      caption: t('testimonial-3-caption'),
      video: '/videos/testimonial3.mp4',
      poster: '/images/testimonial-posters/testimonial3-poster.png',
    },
  ];

  const testimonialsRenderer = () =>
    testimonials.map((testimonial) => (
      <TestimonialVideo
        key={testimonial.key}
        caption={testimonial.caption}
        video={testimonial.video}
        poster={testimonial.poster}
      />
    ));

  return (
    <div id={sectionId} ref={sectionRef}>
      <div className="testimonials-title-container">
        <h2 className="section-title">{t('testimonials')}</h2>
        <span className="section-subtitle">{t('testimonials-subtitle')}</span>
        <p className="section-description">{t('testimonials-description')}</p>
      </div>
      <div className="testimonials-container">{testimonialsRenderer()}</div>
    </div>
  );
};

export default Testimonials;
