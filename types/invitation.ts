export interface StoryTimelineItemData {
  year: string;
  event: string;
  desc: string;
  season?: string;
  duration?: string;
}

export interface EventDetailData {
  id?: string;
  type: string;
  title: string;
  episodeNumber?: number;
  duration?: string;
  synopsis?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  calendarUrl: string;
}

export interface BankAccountData {
  bank: string;
  number: string;
  owner: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
