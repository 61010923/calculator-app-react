import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "rgba(221, 221, 221, 1)",
  fontColor: "#000",
  buttonBg: "rgba(92, 94, 255, 1)",
  buttonBgHover: "rgba(121, 123, 254, 1)",
};

export const darkTheme = {
  body: "rgba(20, 20, 20, 1)",
  fontColor: "#fff",
  buttonBg: "rgb(61 61 61)",
  buttonBgHover: "rgb(89 89 89)",
};

export const GlobalStyles = createGlobalStyle`
	body {
		background-color: ${(props) => props.theme.body};
	}
`;