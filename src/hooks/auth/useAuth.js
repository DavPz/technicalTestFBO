import Swal from "sweetalert2";
import { loginUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogout } from "../../store/slices/auth/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../cart/useCart";

export const useAuth = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user, isAuth} =useSelector(state => state.auth);
    const {handlerClearCartOnLogOut} = useCart();

    // Función para manejar el login
    const handlerLogin = ({email, password}) => {
        
        // Realizar el login del usuario através del servicio loginUser
        const user = loginUser(email, password);

        //Si el usuario no es encontrado, mostrar un mensaje de error
        if (!user) {
            Swal.fire('Error de Login', 'Usuario y/o Password incorrectos', 'error');
            return;
        }

        // Si el usuario es encontrado, despachar la acción onLogin con el usuario encontrado al store
        dispatch(onLogin({user}));

        // Si el usuario es encontrado, guardar el usuario en el sessionStorage y el estado de autenticación
        sessionStorage.setItem('login', JSON.stringify({
            isAuth: true,
            user,
        }));

        // Si el usuario es encontrado, navegar a la ruta /welcome
        navigate('/products');

    }

    // Función para manejar el logout
    const handlerLogout = () => {
        // Despachar la acción onLogout al store
        dispatch(onLogout());

        handlerClearCartOnLogOut();

        // Remover el usuario del sessionStorage
        sessionStorage.removeItem('login');
        sessionStorage.clear();

        // Navegar a la ruta /login
        navigate('/login');
    }

    return {
        login: {
            user,
            isAuth,
        },
        handlerLogin,
        handlerLogout,
    };
}
