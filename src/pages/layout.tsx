// components/layout.js

import React from "react";
import { Header } from "../components";

type Props = {
  children?: JSX.Element;
};

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
