// import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Router } from 'react-router-dom'; //신규 생성. router는 app.js 파일 내의 모든 라우터 정보를 감싸는 역할

import 'bootstrap/dist/css/bootstrap.min.css'; //for bootstrap

const root = ReactDOM.createRoot(document.getElementById('root'));

//StrictMode 비활성화. 개발 도중 발생하는 문제 추가감지 위하여 rendering 2번 수행
// root.render(

//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>
// );

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
