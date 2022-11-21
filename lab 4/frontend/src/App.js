import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './component/Home';
import List from './component/List';
import Error from './component/Error';
import Detail from './component/Detail';
import History from './component/History';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/characters/history' element={<History />} />
          <Route path='/:category/page/:page' element={<List />} />
          <Route path='/error' element={<Error />} />
          <Route path='/:category/:id' element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
