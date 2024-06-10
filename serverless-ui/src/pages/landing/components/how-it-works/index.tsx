import React, { useCallback, useEffect, useRef, useState } from 'react';
import './how-its-works.scss';
import { Card, CardActionArea } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SectionProps } from '../../utils/interface';
import { useLandingPageContext } from '../../context/landing-page-context';

const howItWorksIndecies = ['create', 'branding', 'share'];

const HowItWorks = ({ sectionRef, sectionId }: SectionProps) => {
  const { isNonMobile } = useLandingPageContext();
  const [activeTab, setActiveTab] = useState<number>(0);
  const { t } = useTranslation();
  const isScrollingRef = useRef(false);
  const firstCard = useRef<HTMLDivElement>(null);
  const secondCard = useRef<HTMLDivElement>(null);
  const thirdCard = useRef<HTMLDivElement>(null);
  const howItWorksItems = [
    {
      title: t('how-it-works-step-1-title'),
      description: t('how-it-works-step-1-description'),
      ref: firstCard,
    },
    {
      title: t('how-it-works-step-2-title'),
      description: t('how-it-works-step-2-description'),
      ref: secondCard,
    },
    {
      title: t('how-it-works-step-3-title'),
      description: t('how-it-works-step-3-description'),
      ref: thirdCard,
    },
  ];

  const howItWorksItemsRenderer = () =>
    howItWorksItems.map((item, index) => (
      <Card
        key={`${item.title}-card`}
        className={`how-it-work-item-container ${activeTab === index ? 'active' : ''}`}
        ref={item.ref}
        data-tabindex={index}
      >
        <CardActionArea
          className="how-it-work-item"
          onClick={(e) => {
            e.stopPropagation();
            handleTabClick(index);
          }}
        >
          <div className="how-it-work-item__title_container">
            <span className="how-it-work-item__number">{`${index + 1}.`}</span>
            <h3 className="how-it-work-item__title">{item.title}</h3>
          </div>
          <p className="how-it-work-item__description">{item.description}</p>
        </CardActionArea>
      </Card>
    ));

  const tabLinesRenderer = () => (
    <div className="how-it-work-item-tabs-container">
      {howItWorksItems.map((item, index) => (
        <div
          key={`${item.title}-tab`}
          className={`how-it-work-item-tab ${activeTab === index ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleTabClick(index);
          }}
        />
      ))}
    </div>
  );

  const imagesRenderer = () =>
    howItWorksItems.map((item, index) => (
      <img
        key={`${item.title}-image`}
        src={`/images/how-it-works-${howItWorksIndecies[index]}.png`}
        alt="how it works"
        className={`how-it-works-image ${activeTab === index ? 'active' : ''}`}
      />
    ));

  const mobileAutoScroll = useCallback((tabNumber: number) => {
    isScrollingRef.current = true;
    const carouselContainer: HTMLElement | null | undefined = firstCard.current?.parentElement;
    const leftOffset = howItWorksItems[tabNumber].ref.current?.offsetLeft || 0;
    carouselContainer?.scrollTo({ left: leftOffset, behavior: 'smooth' });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
    if (!isNonMobile) {
      mobileAutoScroll(tabNumber);
    }
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isScrollingRef.current) {
        const tabIndex = parseInt((entry.target as HTMLDivElement).dataset.tabindex || '0', 10);
        setActiveTab(tabIndex);
      }
    });
  };

  useEffect(() => {
    if (!isNonMobile) {
      const observerOptions = {
        root: document.body,
        rootMargin: '0px',
        threshold: 0.5,
      };

      const observer = new IntersectionObserver(handleIntersection, observerOptions);
      howItWorksItems.forEach((item) => {
        if (item.ref.current) {
          observer.observe(item.ref.current);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const activeTabInterval = setInterval(() => {
      const nextTab = (activeTab + 1) % 3;
      setActiveTab(nextTab);
      if (!isNonMobile) {
        mobileAutoScroll(nextTab);
      }
    }, 7000);
    return () => clearInterval(activeTabInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <section id={sectionId} ref={sectionRef}>
      <div className="how-it-works-title-container">
        <h2 className="section-title">{t('how-it-works')}</h2>
        <span className="section-subtitle">{t('how-it-works-subtitle')}</span>
      </div>
      <div className="how-it-works-content-container">
        <div className="how-it-works-content-items-container">
          <div className="how-it-work-carousel">{howItWorksItemsRenderer()}</div>
        </div>
        {!isNonMobile ? tabLinesRenderer() : ''}
        <div className="how-it-works-content-image-container">
          <div className="how-it-works-content-image-wrapper">{imagesRenderer()}</div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
