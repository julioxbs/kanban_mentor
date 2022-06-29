import React from 'react'

interface IToggleContext {
    isHidden: boolean
    setIsHidden: (isHidden: boolean) => void
}

export const ToggleAsideContext = React.createContext({} as IToggleContext);

export const ToggleAsideProvider = ({ children }: any) => {
    const [isHidden, setIsHidden] = React.useState(false);
    
    return (
        <ToggleAsideContext.Provider value={{ isHidden, setIsHidden }}>
        {children}
        </ToggleAsideContext.Provider>
    );
}