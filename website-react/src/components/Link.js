import React from 'react';
import styled from 'styled-components';

const StyledLink = styled.a`
    $link-color: #43a2be;

    &,
    &:link,
    &:visited {
        color: $link-color;
    }

    &:hover,
    &:active {
        color: lighten($link-color, 10%);
    }
`;

export default ({id, className, href, target, children}) => {
    return (
        <StyledLink id={id} className={className} href={href} target={target}>
            {children}
        </StyledLink>
    );
};
