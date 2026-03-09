import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home'
import Drivers from './pages/Drivers/Drivers';
import Races from './pages/Races/Races'
import Teams from './pages/Teams/Teams'
import Guide from './pages/Guide/Guide';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/races" element={<Races />} />
        <Route path='/teams' element={<Teams />} />
        <Route path='/guide' element={<Guide />} />
      </Routes>
    </Layout>
  )
}

export default App