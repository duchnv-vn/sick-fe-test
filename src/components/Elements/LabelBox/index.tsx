import './index.scss';

type Props = {
  name: string;
  className?: string;
};

const LabelBox = ({ name, className = '' }: Props) => {
  return <div className={`label-box ${className}`}>{name}</div>;
};

export default LabelBox;
