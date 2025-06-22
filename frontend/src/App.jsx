import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import ItemList from './pages/ItemList';
import ItemView from './pages/ItemView';
import AddItem from './pages/AddItem';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/item/:id" element={<ItemView />} />
            <Route path="/add-item" element={<AddItem />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;