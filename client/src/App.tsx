import { useState } from "react";
import { DatePicker } from "antd";
import Layout from "./core/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <DatePicker />
      </Layout>
    </>
  );
}

export default App;
