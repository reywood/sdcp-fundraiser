import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import LinkButton from '../../components/LinkButton';

const HeroSection = styled(Section)`
    background-color: transparent;
    background-image: url('/img/stucco-bg2.png');
    font-size: 1.5em;
    text-align: center;
    margin-top: 0;

    h1 {
        margin-top: 0;
        margin-bottom: 0.5em;
        font-size: 2.5em;
        color: #444;
    }

    p {
        text-align: center;
    }

    .page-header-image {
        margin-top: -70px;
        max-width: 776px;
        width: 100%;
        height: auto;

        @media (max-width: $screen-sm-max) {
            & {
                margin-top: -20px;
            }
        }
    }

    .section1-content {
        position: relative;
        max-width: 50em;
        margin: 0 auto;
    }

    .cursive {
        font-size: 1.2em;
    }

    .btn {
        min-width: 8em;
        text-shadow: none;
    }

    .join-us {
        font-size: 0.9em;
    }

    .event-date {
        $event-date-glow-color: #faa;

        color: #000;
        font-family: 'Syncopate', sans-serif;
        font-weight: 500;
        margin-top: 0.5em;
        margin-bottom: 0;
        // text-shadow:  0   -1px  1px $event-date-glow-color,
        //               0    1px  1px $event-date-glow-color,
        //              -1px  0    1px $event-date-glow-color,
        //               1px  0    1px $event-date-glow-color,
        //              -1px -1px  1px $event-date-glow-color,
        //               1px  1px  1px $event-date-glow-color,
        //               1px -1px  1px $event-date-glow-color,
        //              -1px  1px  1px $event-date-glow-color;
    }

    .time-left {
        color: #333;
        font-size: 0.7em;
        margin-top: 0;
        min-height: 1em;
        opacity: 0;

        span {
            display: inline-block;
            white-space: nowrap;
        }
    }

    .benefitting {
        // margin-top: 1em;

        * {
            vertical-align: bottom;
        }

        img {
            @media (max-width: $screen-xs-max) {
                width: 80px;
                height: auto;
            }
        }

        span {
            display: inline-block;
            margin: 0 1rem;
        }
    }

    .internal-page-links {
        margin-top: 2em;

        * {
            vertical-align: middle;
        }

        span {
            display: inline-block;
            margin: 0 1em;
        }

        @media (max-width: $screen-sm-max) {
            & * {
                display: block;
                margin: 0 auto;
            }
        }
    }

    .flower-border-left {
        position: absolute;
        top: 0;
        left: 0;
    }
`;

export default () => {
    return (
        <HeroSection>
            <div className="section1-content">
                <img src="img/header-bg-top.png" width="776" height="260" className="page-header-image" alt="" />

                <p className="join-us">Join us for our</p>

                <h1 className="impact">Annual Gala Fundraiser</h1>

                <h2 className="event-date caps">
                    Friday <nobr>May 15 2020</nobr> <br />
                    <small>7:00pm to 10:00pm</small>
                </h2>

                <p className="time-left">&nbsp;</p>

                <p className="benefitting cursive">
                    <img src="img/flower-deco-left.png" width="192" height="105" alt="" />
                    <span>Benefitting</span>
                    <img src="img/flower-deco-right.png" width="192" height="105" alt="" />
                </p>

                <p className="caps">San Diego Cooperative Preschool</p>

                <p className="internal-page-links">
                    <LinkButton id="buy-tickets-link" href="#buy-tickets" className="js-buy-tickets-link">
                        Buy Tickets
                    </LinkButton>
                    <span className="cursive">or</span>
                    <LinkButton id="donate-link" href="#donate" className="js-donate-link">
                        Donate
                    </LinkButton>
                </p>
            </div>
        </HeroSection>
    );
};
