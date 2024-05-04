import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BaseComponentProps } from '@/utils/type/component.type';

type ButtonProps = BaseComponentProps & {
  label?: string;
  icon?: IconDefinition;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
};

type ButtonIconProps = { icon: IconDefinition; className?: string };

const ButtonIcon = ({ icon, className }: ButtonIconProps) => {
  return <FontAwesomeIcon {...{ icon, className }} />;
};

const Button = (props: ButtonProps) => {
  const {
    label,
    icon,
    className,
    iconClassName,
    iconPosition = 'right',
    labelClassName,
    onClick,
    children,
  } = props;

  const Icon =
    icon &&
    ButtonIcon({
      icon,
      className: `icon ${iconClassName ?? ''}`,
    });

  return (
    <button {...{ className, onClick }}>
      {children ? (
        children
      ) : (
        <>
          {iconPosition == 'left' && Icon}
          {label && (
            <span {...{ className: `label ${labelClassName ?? ''}` }}>
              {label}
            </span>
          )}
          {iconPosition == 'right' && Icon}
        </>
      )}
    </button>
  );
};

export default Button;
