import Home from "./components/Home";
import {BrowserRouter as Router, Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='page-container'>
      <div className='content-wrap'>
        <Router>
          <Route exact path="/" component={Home}></Route>
        </Router>
        <ToastContainer
        position='top-center'
        pauseOnHover={false}
        closeOnClick={true}
        autoClose={1500}
        theme="colored"/>
      </div>
    </div>
  );
}

export default App;
