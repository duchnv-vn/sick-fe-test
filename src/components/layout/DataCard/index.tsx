import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';

type Props = {
  title: string;
  number: number;
  className?: string;
  icon?: IconDefinition;
  iconClassName?: string;
};

const GeneralDataCard = (props: Props) => {
  const { title, number, className = '', icon, iconClassName = '' } = props;

  return (
    <div className={`general-data-card ${className}`}>
      <div className="content">
        <span className="title">{title}</span>
        <span className="number">{number}</span>
      </div>
      {icon && (
        <div className={`icon-wrapper ${iconClassName}`}>
          <FontAwesomeIcon className="icon" icon={icon} />
        </div>
      )}
    </div>
  );
};

export default GeneralDataCard;
