import NextImage, { StaticImageData } from 'next/image';

type Props = {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

const Image: React.FC<Props> = (props) => {
  const { src, alt, width, height, className } = props;

  return <NextImage {...{ src, alt, width, height, className }} />;
};

export default Image;
