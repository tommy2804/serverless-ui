import React from 'react';
import { useTranslation } from 'react-i18next';
import './faq.scss';
import { Button } from '@mui/material';
import { SectionProps } from '../../utils/interface';
import FaqItem from './faq-item';
import { useContactUsContext } from '../../context/contact-us-context';

const Faq = ({ sectionRef, sectionId }: SectionProps) => {
  const { t } = useTranslation();
  const { handleOpenDialog } = useContactUsContext();
  const faqItems = [
    {
      question: t('qa-question-1'),
      answer: t('qa-answer-1'),
    },
    {
      question: t('qa-question-2'),
      answer: t('qa-answer-2'),
    },
    {
      question: t('qa-question-3'),
      answer: t('qa-answer-3'),
    },
    {
      question: t('qa-question-4'),
      answer: t('qa-answer-4'),
    },
    {
      question: t('qa-question-5'),
      answer: t('qa-answer-5'),
    },
    {
      question: t('qa-question-6'),
      answer: t('qa-answer-6'),
    },
  ];

  const faqItemsRenderer = () =>
    faqItems.map((item) => (
      <FaqItem key={`${item.question}-faq-item`} question={item.question} answer={item.answer} />
    ));

  return (
    <section id={sectionId} ref={sectionRef}>
      <div className="faq-title-container">
        <span className="section-subtitle">{t('faq-subtitle')}</span>
        <p className="section-description">{t('faq-description')}</p>
      </div>
      <div className="faq-container">{faqItemsRenderer()}</div>
      <div className="still-have-questions-container">
        <img src="/images/still-have-questions.png" alt={t('still-have-questions')} />
        <span className="still-have-questions-title">{t('still-have-questions')}</span>
        <span className="still-have-questions-subtitle">{t('still-have-questions-subtitle')}</span>
        <Button className="main-button" onClick={handleOpenDialog}>
          {t('get-in-touch')}
        </Button>
      </div>
    </section>
  );
};

export default Faq;
