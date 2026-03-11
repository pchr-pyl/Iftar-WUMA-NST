/**
 * @file App.tsx
 * @description Root application component providing routing for the WUMA Iftar Party registration site.
 */

import React from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import HomePage from './pages/Home'
import './fonts.css'

/**
 * App component renders the router and top-level routes.
 * Currently only the HomePage route is defined.
 */
export default function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  )
}
