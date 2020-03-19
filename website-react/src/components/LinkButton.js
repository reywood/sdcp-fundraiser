import React from 'react';
import styled from 'styled-components';
import Link from './Link';
import {lighten} from '../lib/color';

const buttonBgColor = '#ee8b2f';
const buttonBgColorHover = lighten(buttonBgColor, 0.1);

const LinkButton = styled(Link)`
    border-radius: 0;
    font-size: 1.2em;
    padding: 0.5em 1em;

    &,
    &:link,
    &:active,
    &:hover,
    &:visited {
        background-color: ${buttonBgColor};
        border-width: 0;
        color: #000;
    }

    &:hover {
        background-color: ${buttonBgColorHover};
        color: #000;
    }

    &:focus {
        box-shadow: none;
    }
`;

export default ({id, className, href, children}) => {
    return (
        <LinkButton id={id} className={`btn btn-light ${className}`} href={href}>
            {children}
        </LinkButton>
    );
};
