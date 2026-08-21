import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Provider } from './components/ui/provider';
import { Toaster } from './components/ui/toaster';
import { EventsProvider } from './context/EventsContext';
import { AboutPage } from './pages/AboutPage';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider>
            <EventsProvider>
                <RouterProvider router={router} />
            </EventsProvider>
            <Toaster />
        </Provider>
    </React.StrictMode>,
);
