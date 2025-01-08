import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { meAPI } from "../../modules/auth/utils/api";
import { IAuthContext, IUser } from "../../utils/types";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
}

const defaultState = {
  user: undefined,
  isAdmin: false,
  isLoading: true,
};

const AuthContext = createContext<Partial<IAuthContext>>(defaultState);

export const AuthProvider: FC<Props> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // handle user state
  const checkIfLoggedIn = async () => {

    const isToken = (await localStorage.getItem("token")) as string;

    try {
      setIsLoading(true);

      if (!user && isToken) {
        await meAPI()
          .then((res) => {
            setUser(res)
          })
          .catch((error) => {
            const text = (error as AxiosError<{ message: string }>)?.response
              ?.data;
            const message = text?.message as string;
            toast.error(message)
          });
        setIsAdmin(isAdmin)
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
  }, []);

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
