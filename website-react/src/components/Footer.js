import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
    color: #ddd;
    font-size: 0.8em;
    text-align: center;
    padding-top: 3rem;
    padding-bottom: 3rem;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 0;

    .social-links {
        margin: 0;
        padding: 0;

        a {
            color: #fff;
            margin: 0 0.2em;
        }

        .fa {
            display: inline-block;
            margin: 1em 0.5em;
            font-size: 1.8em;
        }
    }
`;

export default () => {
    return (
        <Footer>
            <p className="social-links">
                <a href="http://www.sdcooppreschool.org/">San Diego Cooperative Preschool</a> is a 501(c)(3) nonprofit
                organization
                <br />
                <a
                    href="https://www.facebook.com/San-Diego-Cooperative-Preschool-UCP-132776756765321/"
                    title="Facebook"
                >
                    <span className="fa fa-facebook-square">
                        <span className="sr-only">Facebook</span>
                    </span>
                </a>
                <a href="https://www.yelp.com/biz/san-diego-cooperative-preschool-san-diego" title="Yelp">
                    <span className="fa fa-yelp">
                        <span className="sr-only">Yelp</span>
                    </span>
                </a>
            </p>
            <div className="clearfix"></div>
        </Footer>
    );
};
