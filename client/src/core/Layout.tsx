import React, { ReactNode, Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  background-color: #00a83d;

  li {
    a {
      color: white;
    }

    list-style: none;
    padding: 10px;
  }
`;

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  const nav = () => (
    <Nav>
      <li className="nav-item">
        <Link to="/" className="text-light nav-link">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/signin" className="text-light nav-link">
          Signin
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/signup" className="text-light nav-link">
          Signup
        </Link>
      </li>
    </Nav>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
}

export default Layout;
