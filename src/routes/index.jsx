import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import { RegisterUser } from "../pages/UserRegister"
import { Home } from "../pages/Home"
import { PrivateRoute } from "./privateRoute"
import { RegisterSubject } from "../pages/admin/RegisterSubject"
import { Management } from "../pages/admin/Management"
import { Trails } from "../pages/Trails"
import { Subjects } from "../pages/Subjects"
import { Scheduler } from "../pages/Scheduler/index.jsx"
import { Information } from "../pages/Information"
import AudioVisual from "../pages/Trails/AudioVisual/index.jsx";
import DesignInterativo from "../pages/Trails/DesignInterativo/index.jsx";
import Jogos from "../pages/Trails/Jogos/index.jsx";
import SistemasMultimidia from "../pages/Trails/SistemasMultimidia/index.jsx";
import { EditSubject } from "../pages/admin/EditSubject"
import { isAuthenticated } from "../../services/auth"

function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}

export function Rotas() {
   return( 
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<RegisterUser />} /> 

        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/trilhas" element={<PrivateRoute><Trails /></PrivateRoute>} />
        <Route path="/scheduler" element={<PrivateRoute><Scheduler /></PrivateRoute>} />
        <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
        <Route path="/info" element={<PrivateRoute><Information /></PrivateRoute>} />
        <Route path="/management" element={<PrivateRoute><Management /></PrivateRoute>} />
        <Route path="/cadastrar_cadeira" element={<PrivateRoute><RegisterSubject /></PrivateRoute>} />
        <Route path="/editar_cadeira" element={<PrivateRoute><EditSubject /></PrivateRoute>} />
        <Route path="/trilhas/sistemas" element={<PrivateRoute><SistemasMultimidia /></PrivateRoute>} />
        <Route path="/trilhas/jogos" element={<PrivateRoute><Jogos /></PrivateRoute>} />
        <Route path="/trilhas/design" element={<PrivateRoute><DesignInterativo /></PrivateRoute>} />
        <Route path="/trilhas/audiovisual" element={<PrivateRoute><AudioVisual /></PrivateRoute>} />

        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
   )
}