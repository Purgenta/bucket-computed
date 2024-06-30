export class CreateSensorReadingDto {
  sensorId: string;
  date: Date;
  location: string;
  sensorType: string;
  unit: string;
  description: string;
  value: {
    date: Date;
    value: number;
    unit: string;
  }
}