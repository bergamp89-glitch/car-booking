import { createContext, useState, useEffect, useContext } from 'react';
import { MOCK_CARS } from '../utils/mockData';

const CarContext = createContext();

export function useCars() {
  return useContext(CarContext);
}

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Load from local storage or initialize with mock data
    const storedCars = localStorage.getItem('carbooking_cars');
    if (storedCars) {
      setCars(JSON.parse(storedCars));
    } else {
      setCars(MOCK_CARS);
      localStorage.setItem('carbooking_cars', JSON.stringify(MOCK_CARS));
    }
  }, []);

  const addCar = (newCar) => {
    const nextId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
    const carToAdd = {
      ...newCar,
      id: nextId,
      status: 'ACTIVE', // Host adds car directly as active
    };
    const updatedCars = [...cars, carToAdd];
    setCars(updatedCars);
    localStorage.setItem('carbooking_cars', JSON.stringify(updatedCars));
  };

  const updateCar = (id, updatedFields) => {
    const updatedCars = cars.map(car => car.id === id ? { ...car, ...updatedFields } : car);
    setCars(updatedCars);
    localStorage.setItem('carbooking_cars', JSON.stringify(updatedCars));
  };

  const deleteCar = (id) => {
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);
    localStorage.setItem('carbooking_cars', JSON.stringify(updatedCars));
  };

  const toggleStatus = (id, newStatus) => {
    updateCar(id, { status: newStatus });
  };

  const value = {
    cars,
    addCar,
    updateCar,
    deleteCar,
    toggleStatus
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
}
