import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
    padding: 0 2rem 2rem;
    margin-top: 1rem;

    h2,
    h3,
    h4 {
        margin-top: 1em;
        margin-bottom: 1em;
        text-align: center;

        &:not(:first-child) {
            margin-top: 1.5em;
        }
    }

    h2.impact {
        font-size: 3rem;
    }

    h3.impact {
        font-size: 2.3rem;
    }

    h2.impact,
    h3.impact {
        color: #43a2be;
    }

    p {
        margin-left: auto;
        margin-right: auto;
        max-width: 50em;
        text-align: justify;

        &.center {
            text-align: center;
        }
    }
`;

export default ({children, className}) => {
    return <Section className={className}>{children}</Section>;
};
