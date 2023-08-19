export class AppError {
  message: string;
  status: number | undefined = 500;

  constructor(message: string, status?: number) {
    this.message = message;
    this.status = status;
  }
}
