import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./components/GlobalStyles";
import AuthContextProvider from "./context/authContext";
import PostContextProvider from "./context/postContext";
import MessageProvider from "./context/message";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthContextProvider>
                <PostContextProvider>
                    <MessageProvider>
                        <App />
                    </MessageProvider>
                </PostContextProvider>
            </AuthContextProvider>
        </GlobalStyles>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
