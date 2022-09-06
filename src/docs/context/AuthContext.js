import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext";

interface AuthContextProps {
  errorMessage: String;
  token: String;
  initialRoute?: String;
}


const authReducer = (state, action) => {
  switch (action.type) {
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "stack_session":
      return {token: action.payload, initialRoute: "Inicio"}
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signIn = (dispatch) => async ({code}) => {
  try {
   /* if(code.length == 9){
      const data = await GQL_API_CONTENT.validCode(code);
      if(data.used_code == "true"){
          await AsyncStorage.setItem("@dataCode", data.used_code);
          await AsyncStorage.setItem("@session", "true");
          dispatch({
            type: "stack_session",
            payload: "Something went wrong with sign in",
          });
      }else{
        console.log("Error, codigo ingresado esta inactivo.");
      }
    }else{
      console.log("Error, el codigo debe tener 9 digitos.");
    }  */
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  /* await AsyncStorage.removeItem("token"); */
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signIn, signout, clearErrorMessage},
  { token: null, initialRoute:"SignIn", isLoading: true}
);
