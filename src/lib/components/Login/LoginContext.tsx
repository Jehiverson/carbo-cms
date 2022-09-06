import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface LoginContextProps {
    errorMessage: string;
    token: string;
}

export const LoginContext = createContext<LoginContextProps>({
    errorMessage: "",
    token:""
  });

interface LoginProviderProps {
children: ReactNode;
value: LoginContextProps;
}

export const ThemeProvider: FC<LoginProviderProps> = ({ children, value }) => {
return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

export function useLogin(): LoginContextProps {
    return useContext(LoginContext);
}