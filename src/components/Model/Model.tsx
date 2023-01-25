import { useEffect, useRef } from "react";
import { main } from "./mountModel";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background: teal;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

export default function Model() {
  const thisEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(thisEl.current);
    main();
  }, []);

  return (
    <div ref={thisEl}>
      <GlobalStyle />
      <Canvas id="canvas" />
    </div>
  );
}
