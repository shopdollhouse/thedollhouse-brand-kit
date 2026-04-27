import archMark from '@/assets/arch-mark.svg';

type DollhouseMarkProps = {
  size?: number;
  className?: string;
};

export default function DollhouseMark({ size = 52, className = '' }: DollhouseMarkProps) {
  return (
    <img
      src={archMark}
      width={size}
      height={size}
      alt="The Dollhouse"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
    />
  );
}