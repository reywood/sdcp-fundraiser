import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
    // padding: 3rem 2rem;
    padding-top: 0;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
    margin-top: 1rem;

    @media (max-width: $screen-sm-max) {
        & {
            // padding: 2rem;
            // margin-top: 2rem;
        }
    }
`;

export default props => {
    return <Section>{props.children}</Section>;
};
