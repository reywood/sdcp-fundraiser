import React from 'react';
import styled from 'styled-components';
import Section from './Section';

const HeroSection = styled.div`
    background-color: transparent;
    background-image: url('/img/stucco-bg2.png');
    font-size: 1.5em;
    text-align: center;
    margin-top: 0;
`;

export default () => {
    return (
        <Section>
            <HeroSection>
                <div class="section1-content">
                    <img src="img/header-bg-top.png" width="776" height="260" class="page-header-image" alt="" />

                    <p class="join-us">Join us for our</p>

                    <h1 class="impact">Annual Gala Fundraiser</h1>

                    <h2 class="event-date caps">
                        Friday <nobr>May 15 2020</nobr> <br />
                        <small>7:00pm to 10:00pm</small>
                    </h2>

                    <p class="time-left">&nbsp;</p>

                    <p class="benefitting cursive">
                        <img src="img/flower-deco-left.png" width="192" height="105" alt="" />
                        <span>Benefitting</span>
                        <img src="img/flower-deco-right.png" width="192" height="105" alt="" />
                    </p>

                    <p class="caps">San Diego Cooperative Preschool</p>

                    <p class="internal-page-links">
                        <a id="buy-tickets-link" href="#buy-tickets" class="btn btn-light js-buy-tickets-link">
                            Buy Tickets
                        </a>
                        <span class="cursive">or</span>
                        <a id="donate-link" href="#donate" class="btn btn-light js-donate-link">
                            Donate
                        </a>
                    </p>
                </div>
            </HeroSection>
        </Section>
    );
};
