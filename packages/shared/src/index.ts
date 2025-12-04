export type Person = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

export type Event = {
  id: string;
  title: string;
  startsAt: string; // ISO
  location: string;
};

export type Registration = {
  id: string;
  eventId: string;
  personId: string;
  createdAt: string; // ISO
};
