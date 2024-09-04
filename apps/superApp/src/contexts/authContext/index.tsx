import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { meAPI } from "../../modules/auth/utils/api";
import { IAuthContext, IUser } from "../../utils/types";

interface Props {
  children: ReactNode;
}

const defaultState = {
  user: null,
  isAdmin: false,
  isLoading: true,
};

const AuthContext = createContext<Partial<IAuthContext>>(defaultState);

export const AuthProvider: FC<Props> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isToken = (localStorage.getItem("token")) as string;
  // handle user state
  const checkIfLoggedIn = async () => {
    try {
      setIsLoading(true);
      const isToken = (await localStorage.getItem("token")) as string;

      if (!user && isToken) {
        await meAPI()
          .then((res) => {
            setUser(res)
          })
          .catch((error) => {
            const text = (error as AxiosError<{ message: string }>)?.response
              ?.data;
            const message = text?.message as string;
            // messange({ message: message, status: "error" })
          });
        // setIsAdmin(isAdmin)
      } else {
        throw new Error("token unavailable");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, [isToken]);

  // values to share in the context
  const values = {
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    isLoading: isLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
