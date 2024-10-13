import { IconProps } from '@iconscout/react-unicons'
import { cn } from '@/lib/utils'

export const UilTwitterX = (props: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={props.size || 20}
      height={props.size || 20}
      fill='none'
      viewBox='0 0 512 512'
      id='twitter'
    >
      <g clipPath='url(#a)'>
        <rect width='512' height='512' fill='#000' rx='60' />
        <path
          fill='#fff'
          d='M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <rect width='512' height='512' fill='#fff' />
        </clipPath>
      </defs>
    </svg>
  )
}

// Kawalan Studio | https://iconscout.com/contributors/kawalanicon
export const UilFlag = (props: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={props.size || 20}
      height={props.size || 20}
      viewBox="0 0 32 32"
      id='flag'
    >
      <path fill="currentColor" d="M22.23,13l4.58-6.42A1,1,0,0,0,26,5H7V4A1,1,0,0,0,5,4V28a1,1,0,0,0,2,0V21H26a1,1,0,0,0,.81-1.58ZM7,19V7H24.06l-3.87,5.42a1,1,0,0,0,0,1.16L24.06,19Z" />
    </svg>
  )
}

export const UilSpinner = (props: IconProps) => {
  return (<svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", props.className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>)
}