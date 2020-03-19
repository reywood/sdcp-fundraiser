import React from 'react';
import styled from 'styled-components';

export default styled.div`
    max-width: 681px;
    width: 95%;
    height: 0;
    margin: 2em auto;
    padding-bottom: 10%;
    background-image: url('/img/ruler1.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    @media (max-width: $screen-xs-max) {
        padding-bottom: 15%;
    }
`;
