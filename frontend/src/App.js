// import { useSelector } from "react-redux";
// import AllRoute from "./routes/AllRoute";
// import Navbar from "./components/UserComponents/UserNavbar";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { Box, Text } from "@chakra-ui/react";

// function App() {
//   const userStore = useSelector((store) => store.UserReducer);

//   return (
//     <div className="App">
//       <Router>
//         {/* {userStore?.role === "admin" || userStore?.role === 'teacher' ? <Navbar /> : null} */}
//         <Routes>
//           <Route path="*" element={<AllRoute />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
import { useSelector } from "react-redux";
import AllRoute from "./routes/AllRoute";
import Navbar from "./components/UserComponents/UserNavbar";
import { Box, Text } from "@chakra-ui/react";



function App() {
  const userStore = useSelector((store)=>store.UserReducer);
  return (
    <div className="App">
    {userStore?.role === "admin" || userStore?.role==='teacher' ? <Navbar/> : null}
      <AllRoute />
    </div>
  );
}



export default App;
