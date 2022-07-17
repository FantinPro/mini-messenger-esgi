import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import ErrorBoundary from './components/error/ErrorBoundary';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <CssBaseline>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <App />
                </LocalizationProvider>
            </CssBaseline>
        </ErrorBoundary>
    </BrowserRouter>
);
