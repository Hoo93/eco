import { LocalDateTime } from '@js-joda/core';

export interface PpurioAccessToken {
  token: string;
  type: string;
  expired: LocalDateTime;
}
