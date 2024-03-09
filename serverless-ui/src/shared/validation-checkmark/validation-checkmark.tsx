import './validation-checkmark.scss';

interface ValidationCheckmarkProps {
  selected: boolean;
  text: string;
}

const ValidationCheckmark = ({ selected = false, text }: ValidationCheckmarkProps) => (
  <div className="validation-checkmark-wrapper">
    {selected ? (
      <div className="validation-wrapper">
        <div className="checkmark-wrapper green-validation">
          <div className="checkmark-icon">✓</div>
        </div>
        <div>{text}</div>
      </div>
    ) : (
      <div className="validation-wrapper">
        <div className="checkmark-wrapper gray-validation">
          <div className="checkmark-icon">✓</div>
        </div>
        <div>{text}</div>
      </div>
    )}
  </div>
);

export default ValidationCheckmark;
