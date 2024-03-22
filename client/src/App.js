import './App.css';
import { Header } from './components/Header';
import { TestBody } from './components/TestBody';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Routes>
      <Route path="/" element={<TestBody />} />
      <Route path="/" element={<TestBody />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;

{/* <TestBody /> */}
