import Navbar from "./components/Navbar";
import CollectionData from "./pages/CollectionData";
import CreateEntity from "./pages/CreateEntity";
import CreateNewRow from "./pages/CreateNewRow";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UpdateCollection from "./pages/UpdateCollection";

function App() {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Navbar />
        <hr className="pb-10" />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/update/collection/:name" Component={UpdateCollection} />
          <Route path="*" Component={ErrorPage} />
          <Route
            path="/collection/:collectionName"
            Component={CollectionData}
          />
          <Route
            path="/collection/:collectionName/add-row"
            Component={CreateNewRow}
          />
          <Route path="/create-collection" Component={CreateEntity} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
