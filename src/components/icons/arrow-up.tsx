import type { SVGProps } from 'react';

interface ArrowUpProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeColor?: string;
}

export const ArrowUp = ({
  size = 10,
  strokeColor = '#DDDDDF',
  ...props
}: ArrowUpProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 10 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M0.75 0.75H9.08333M9.08333 0.75V9.08333M9.08333 0.75L0.75 9.08333'
        stroke={strokeColor}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
