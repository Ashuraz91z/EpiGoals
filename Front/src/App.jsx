import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home"; // Import your component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
