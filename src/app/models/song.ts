export class Song {
  public obj: {};
  constructor(
    public id: string,
    public albumName: string,
    public artistName: string,
    public songDescription: string,
    public songName: string,
    public userId?: string
  ) {
    this.obj = {
      id: this.id,
      albumName: this.albumName,
      artistName: this.artistName,
      songDescription: this.songDescription,
      songName: this.songName,
      userId: this.userId
    };
  }
}
