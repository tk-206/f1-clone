import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home'
import Drivers from './pages/Drivers/Drivers';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
      </Routes>
    </Layout>
  )
}

export default App