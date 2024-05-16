import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SectionProps } from '../../utils/interface';
import './events-types.scss';

const EventsTypes = ({ sectionRef, sectionId }: SectionProps) => {
  const { t } = useTranslation();
  const eventsTypes = [
    {
      title: t('events-type-weddings'),
      description: t('events-type-weddings-description'),
    },
    {
      title: t('events-types-business'),
      description: t('events-types-business-description'),
    },
    {
      title: t('events-type-birthdays'),
      description: t('events-types-birthdays-description'),
    },
    {
      title: t('events-type-parties'),
      description: t('events-types-parties-description'),
    },
    {
      title: t('events-types-conference'),
      description: t('events-types-conference-description'),
    },
    {
      title: t('events-types-corporate'),
      description: t('events-types-corporate-description'),
    },
  ];

  const eventsTypesRenderer = () =>
    eventsTypes.map((item) => (
      <Grid item xs={12} md={6} lg={4} key={item.title}>
        <div className="event-type-container">
          <div className="event-type-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="zap">
                <path
                  id="Icon"
                  d="M12.9999 2L4.09332 12.6879C3.74451 13.1064 3.57011 13.3157 3.56744 13.4925C3.56512 13.6461 3.63359 13.7923 3.75312 13.8889C3.89061 14 4.16304 14 4.7079 14H11.9999L10.9999 22L19.9064 11.3121C20.2552 10.8936 20.4296 10.6843 20.4323 10.5075C20.4346 10.3539 20.3661 10.2077 20.2466 10.1111C20.1091 10 19.8367 10 19.2918 10H11.9999L12.9999 2Z"
                  stroke="#E31B54"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <h3 className="event-type-title">{item.title}</h3>
          <p className="event-type-description">{item.description}</p>
        </div>
      </Grid>
    ));

  return (
    <section id={sectionId} ref={sectionRef}>
      <div className="events-types-title-container">
        <h2 className="section-title">{t('events-types')}</h2>
        <span className="section-subtitle">{t('events-type-subtitle')}</span>
        <p className="section-description">{t('events-types-description')}</p>
      </div>
      <Grid container spacing={{ xs: 5, lg: 4 }} className="events-types-items-container">
        {eventsTypesRenderer()}
      </Grid>
    </section>
  );
};
export default EventsTypes;
