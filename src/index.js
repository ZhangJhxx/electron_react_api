import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.css';
import App from "./pages/Quick_api/App.jsx"
import "./css/reset.css"

const container = document.getElementById('app');
const root = createRoot(container); 


root.render(<App tab="home" />);