import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GifDetailsPage from "./pages/GifDetailsPage";
import type { JSX } from "react/jsx-dev-runtime";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gif/:id" element={<GifDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}