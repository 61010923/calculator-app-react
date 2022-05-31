import { useReducer, useState } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./App.css"
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes.js";
import { BsFillSunFill } from 'react-icons/bs';
import { MdNightlightRound } from "react-icons/md";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


const CalculatorContainer = styled.div`
  color: ${(props) => props.theme.fontColor};
  display: grid;
  grid-template-columns: repeat(4, 6rem);
  grid-template-rows: minmax(7rem, auto) repeat(5, 6rem);
  background-color: rgba(0, 0, 0, 1);
  padding: 1rem;
  border-radius: 1rem;

  box-shadow:20px 20px 50px rgba(0,0,0,0.5);
  background:rgba(255,255,255,0.1);
  overflow:hidden;
  border-top:1px solid rgba(255,255,255,0.5);
  border-left:1px solid  rgba(255,255,255,0.5);
  backdrop-filter:blur(5px);
                        
                       

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 2rem;
    margin: 5px;
    border: none;
    outline: none;
    background-color: ${(props) => props.theme.buttonBg};
    color: #fff;
    border-radius: 1rem;
    transition: 0.5s;
    &:hover {
      background-color: ${(props) => props.theme.buttonBgHover};
    }
  }

  .span-two {
    grid-column: span 2;
  }
  
  .output {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    padding: .75rem;
    word-wrap: break-word;
    word-break: break-all;
    border-radius: 1rem;
  
  }
  
  .output .previous-operand {
    color: ${(props) => props.theme.fontColor};
    font-size: 1.5rem;
    opacity: 0.75;
  }
  
  .output .current-operand {
    color: ${(props) => props.theme.fontColor};
    font-size: 2.5rem;
  }
`;

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  const [theme, setTheme] = useState("light");
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
    <CalculatorContainer>
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
       AC
      </button>
      <button onClick={() => themeToggler()}>
        {theme === "light" ? <MdNightlightRound/> : <BsFillSunFill/> }
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </CalculatorContainer>
    </ThemeProvider>
  )
}

export default App
