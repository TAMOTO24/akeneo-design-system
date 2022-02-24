import { FC, HTMLAttributes, ReactElement } from 'react';
import { Override } from '../../shared';
import { IllustrationProps } from '../../illustrations/IllustrationProps';
declare type PlaceholderSize = 'default' | 'large';
declare type PlaceholderProps = Override<HTMLAttributes<HTMLDivElement>, {
    title: string;
    illustration: ReactElement<IllustrationProps>;
    size?: PlaceholderSize;
}>;
declare const Placeholder: FC<PlaceholderProps>;
export { Placeholder };
