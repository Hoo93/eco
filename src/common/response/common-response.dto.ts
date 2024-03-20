export class CommonResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;

  constructor(message: string, data?: T, success: boolean = true) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
