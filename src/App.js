import React from "react";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Page from "./Page/Page";

function App() {
  return (
    <>
      <Layout>
        <Header>
          <span style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Digital Habits. Entrance test done by Yury Starodubov
          </span>
        </Header>
        <Content>
          <Page />
        </Content>
      </Layout>
    </>
  );
}

export default App;


