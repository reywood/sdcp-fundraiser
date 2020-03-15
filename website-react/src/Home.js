import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import HeroSection from './HeroSection';

const Content = styled.div`
    background-color: #fff;
    color: #333;
`;

export default () => {
    ReactGA.pageview(window.location.pathname + window.location.search);

    return (
        <Content>
            <HeroSection />
        </Content>
    );
};
