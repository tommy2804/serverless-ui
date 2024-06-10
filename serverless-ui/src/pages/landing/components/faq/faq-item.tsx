import { useCallback, useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleAccordionChange = useCallback(() => {
    setExpanded((prevExpanded) => !prevExpanded);
  }, []);

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      className="faq-item"
      sx={{
        '&.MuiAccordion-root:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          expanded ? (
            <RemoveCircleOutlineIcon sx={{ color: 'var(--gary-400)' }} />
          ) : (
            <ControlPointIcon sx={{ color: 'var(--gary-400)' }} />
          )
        }
        sx={{
          margin: '0',
          '&.Mui-expanded': {
            margin: '0',
            minHeight: '0',
            ' &:before': {
              opacity: '1',
            },
          },
          '& .MuiAccordionSummary-content': {
            margin: '0',
          },
        }}
      >
        <span className="faq-question">{question}</span>
      </AccordionSummary>
      <AccordionDetails>
        <p className="faq-answer">{answer}</p>
      </AccordionDetails>
    </Accordion>
  );
};

export default FaqItem;
