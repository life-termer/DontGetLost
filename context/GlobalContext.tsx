import { createContext, useState } from "react";

export const GlobalContext = createContext<{ isScanning: boolean; setIsScanning: (value: boolean) => void }>({
    isScanning: false,
    setIsScanning: () => {},
});

import { ReactNode } from "react";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    //authInitialState can be whatever you want, ex: {rand: {}, rand2: null}
    const [isScanning, setIsScanning] = useState(false);

    return (
        <GlobalContext.Provider
            value={{isScanning, setIsScanning}}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;