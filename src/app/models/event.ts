export class Event {
  public obj: {};
  constructor(
    public id: string,
    public eventName: string,
    public eventDescription: string,
    public eventLocation: string,
    public eventDate: string,
    public userId?: string
  ) {
    this.obj = {
      id: this.id,
      eventName: this.eventName,
      eventDescription: this.eventDescription,
      eventLocation: this.eventLocation,
      eventDate: this.eventDate,
      userId: this.userId
    };
  }
}
