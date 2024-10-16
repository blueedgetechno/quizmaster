declare module '@iconscout/react-unicons' {
  import { SVGProps } from 'react'

  export type IconProps = {
    color?: string
    size?: string | number
  } & SVGProps<SVGElement>

  export type Icon = (props: IconProps) => JSX.Element

  export const UilEnvelopeAlt: Icon
  export const UilGithub: Icon
}
