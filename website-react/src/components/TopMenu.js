import React from 'react';
import styled from 'styled-components';
import Link from './Link';

const NavbarToggler = ({target}) => {
    return (
        <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target={`#${target}`}
            aria-controls={target}
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
    );
};

const StyledNav = styled.nav`
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    font-size: 0.9rem;
    padding-bottom: 0;
    padding-top: 0;
    transition: background-color 0.7s;
`;
const Navbar = ({children}) => {
    return (
        <StyledNav className="navbar navbar-expand navbar-light fixed-top justify-content-center justify-content-md-end">
            <NavbarToggler target="navbarSupportedContent" />
            <div className="collapse navbar-collapse w-100" id="navbarSupportedContent">
                <ul className="navbar-nav w-100 justify-content-center justify-content-md-end">{children}</ul>
            </div>
        </StyledNav>
    );
};

const NavLink = ({className, children, ...rest}) => {
    return (
        <Link className={`nav-link ${className}`} {...rest}>
            {children}
        </Link>
    );
};

const NavItem = ({className, href, children}) => {
    return (
        <li className="nav-item">
            <NavLink className={className} href={href}>
                {children}
            </NavLink>
        </li>
    );
};

export default () => {
    return (
        <header>
            <Navbar>
                <NavItem className="js-buy-tickets-link" href="#buy-tickets">
                    Buy Tickets
                </NavItem>
                <NavItem className="js-donate-link" href="#donate">
                    Donate
                </NavItem>
                <NavItem className="js-location-link" href="#location">
                    Location
                </NavItem>
                {/*
                <NavItem className="nav-link" href="http://go.cause4auction.com/sdcp2020">
                    Auction
                </NavItem>
                */}
            </Navbar>
        </header>
    );
};
