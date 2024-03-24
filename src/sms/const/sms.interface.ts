export interface SmsInterface {
  requestSend(recipent: string, message: string): Promise<void>;
}
