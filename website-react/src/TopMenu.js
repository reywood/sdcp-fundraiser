import React from 'react';
import styled from 'styled-components';

const TopMenuHeader = styled.header`
    nav.navbar {
        background-color: rgba(#fff, 0.95);
        box-shadow: 0 5px 5px rgba(#000, 0.2);
        font-size: 0.9rem;
        padding-bottom: 0;
        padding-top: 0;
        transition: background-color 0.7s;
    }
`;

export default () => {
    return (
        <TopMenuHeader>
            <nav class="navbar navbar-expand navbar-light fixed-top justify-content-center justify-content-md-end">
                <button
                    class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse w-100" id="navbarSupportedContent">
                    <ul class="navbar-nav w-100 justify-content-center justify-content-md-end">
                        <li class="nav-item">
                            <a class="nav-link js-buy-tickets-link" href="#buy-tickets">
                                Buy Tickets
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link js-donate-link" href="#donate">
                                Donate
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link js-location-link" href="#location">
                                Location
                            </a>
                        </li>
                        {/* <li class="nav-item">
                            <a class="nav-link" href="http://go.cause4auction.com/sdcp2020">
                                Auction
                            </a>
                        </li> */}
                    </ul>
                </div>
            </nav>
        </TopMenuHeader>
    );
};
