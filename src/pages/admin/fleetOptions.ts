import type { VehicleTypeValues } from "./forms/AddVehicleTypeForm"

export type VehicleTypeOption = VehicleTypeValues & { id: string }

export const branches = [
  { id: "1", name: "Westlands" },
  { id: "2", name: "Airport branch" },
  { id: "3", name: "CBD branch" },
]

export const vehicleTypeOptions: VehicleTypeOption[] = [
  { id: "1", name: "Economy sedan", description: "Efficient city driving", seatingCapacity: "5", transmissionType: "Automatic", fuelType: "Petrol", dailyBaseRate: "6500" },
  { id: "2", name: "Compact hatchback", description: "Easy to park and maneuver", seatingCapacity: "5", transmissionType: "Manual", fuelType: "Petrol", dailyBaseRate: "4800" },
  { id: "3", name: "Family SUV", description: "Extra space for passengers and luggage", seatingCapacity: "7", transmissionType: "Automatic", fuelType: "Diesel", dailyBaseRate: "12500" },
  { id: "4", name: "Electric sedan", description: "Quiet, zero-emission travel", seatingCapacity: "5", transmissionType: "Automatic", fuelType: "Electric", dailyBaseRate: "15000" },
]

export const pricingTypeOptions = ["Daily", "Weekly", "Monthly", "Weekend", "Seasonal"]