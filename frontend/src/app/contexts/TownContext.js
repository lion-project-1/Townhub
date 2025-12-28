import { createContext, useContext, useState, useEffect } from "react";

const TownContext = createContext(undefined);

export function TownProvider({ children }) {
  const [selectedTown, setSelectedTown] = useState(null);

  useEffect(() => {
    const savedTown = localStorage.getItem("selectedTown");
    if (savedTown) {
      setSelectedTown(JSON.parse(savedTown));
    }
  }, []);

  const selectTown = (town) => {
    setSelectedTown(town);
    localStorage.setItem("selectedTown", JSON.stringify(town));
  };

  const clearTown = () => {
    setSelectedTown(null);
    localStorage.removeItem("selectedTown");
  };

  return (
    <TownContext.Provider value={{ selectedTown, selectTown, clearTown }}>
      {children}
    </TownContext.Provider>
  );
}

export function useTown() {
  const context = useContext(TownContext);
  if (!context) {
    throw new Error("useTown must be used within TownProvider");
  }
  return context;
}
