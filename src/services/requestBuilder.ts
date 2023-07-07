import { IRI } from "@/models/interfaces"
import { user } from "./auth";

/*
http://127.0.0.1:8000/api/events.json
?name=My cool&organiser.site=1
&startDateTime[after]=2023-08-15
&registrationDeadline[before]=2023-08-15
&or[organizer]=1
&or[not][organizer]=1
&or[participants]=1
&or[registrationDeadline][before]=2023-08-15
*/

export interface EventRequestInstructions {
  name?: string,
  site?: number | IRI,
  startDate?: string,
  endDate?: string,
  userIsOrganizer?: boolean,
  userIsParticipant?: boolean,
  userIsNotParticipant?: boolean,
  includePastEvents?: boolean
}

export class RequestInstructor {

  private static _instance: RequestInstructor;
  private erb = new EventRequestBuilder();

  private constructor() {
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new RequestInstructor();
    }
    return this._instance;
  }

  public makeEventRequest(inst: EventRequestInstructions): string {
    this.erb.reset();
    inst.name && this.erb.addName(inst.name);
    inst.site && this.erb.addSite(inst.site);
    inst.startDate && this.erb.addStart(inst.startDate);
    inst.endDate && this.erb.addEnd(inst.endDate);
    inst.userIsOrganizer && this.erb.addIsOrganizer()
    inst.userIsParticipant &&this.erb.addIsParticipant()
    inst.userIsNotParticipant && this.erb.addNotParticipant()
    inst.includePastEvents && this.erb.addPast()
    return this.erb.request
  }
}

export class EventRequestBuilder {
  
  private _request!: string;

  public constructor() {
    this.reset();
  }

  public reset() {
    this._request = process.env.NEXT_PUBLIC_SERVER_URL!+'events.json?';
  }

  private appendSeparator() {
    if (!this._request.endsWith('?')) { this._request += '&'; }
  }
  
  public addName(name: string): void {
    this.appendSeparator();
    this._request += `name=${name}`;
  }

  public addSite(site: number | IRI): void {
    this.appendSeparator();
    this._request += `organiser.site=${site}`;
  }

  public addStart(startDate: string): void {
    this.appendSeparator();
    this._request += `startDateTime[after]=${startDate}`;
  }

  public addEnd(endDate: string): void {
    this.appendSeparator();
    this._request += `registrationDeadline[before]=${endDate}`;
  }

  public addIsOrganizer(): void {
    this.appendSeparator();
    this._request += `or[organiser]=${user.id}`;
  }

  public addIsParticipant(): void {
    this.appendSeparator();
    this._request += `or[participants]=${user.id}`;
  }
  
  public addNotParticipant(): void {
    this.appendSeparator();
    this._request += `or[not][participants]=${user.id}`;
  }
  
  public addPast(): void {
    this.appendSeparator();
    const now = new Date()
    this._request += `or[registrationDeadline][before]=${now.toLocaleDateString}`;
  }

  public get request(): string {
    console.log(this._request)
    return this._request;
  }
}