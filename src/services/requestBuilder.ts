import { IRI, User } from "@/models/interfaces"

/**
 * Classes en charge de construire une requete complexe.
 * Actuellement, elle ne sert qu'à générer la requete filtrée des Events.
 */
export interface EventRequestInstructions {
  name?: string | null,
  site?: number | IRI | null,
  startDate?: Date | null,
  endDate?: Date | null,
  userIsOrganizer?: boolean | undefined,
  userIsParticipant?: boolean | undefined,
  userIsNotParticipant?: boolean | undefined,
  includePastEvents?: boolean | undefined
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
    this.erb.addDefault();
    inst.name && this.erb.addName(inst.name);
    inst.site && this.erb.addSite(inst.site);
    inst.startDate && this.erb.addStart(inst.startDate.toISOString());
    inst.endDate && this.erb.addEnd(inst.endDate.toISOString());  
    inst.userIsOrganizer && this.erb.addIsOrganizer();
    if ((inst.userIsParticipant && !inst.userIsNotParticipant) || (!inst.userIsParticipant && inst.userIsNotParticipant)) {
      inst.userIsParticipant && this.erb.addIsParticipant();
      inst.userIsNotParticipant && this.erb.addNotParticipant();
    }
    inst.includePastEvents && this.erb.addPast();
    return this.erb.request;
  }
}

export class EventRequestBuilder {
  
  private _request!: string;
  private _user: User = JSON.parse(sessionStorage.getItem("user")!);
  private _optionals: string = 'and[or]';

  public constructor() {
    this.reset();
  }

  public reset() {
    this._request = process.env.NEXT_PUBLIC_SERVER_URL!+'events.json?';
    this._optionals = 'and[or]';
  }

  private appendSeparator() {
    if (!this._request.endsWith('?')) { this._request += '&'; }
  }

  public opts(): string {
    const opt = this._optionals;
    this._optionals = 'or'
    return opt
  }

  public addDefault() {
    this.appendSeparator();
    this._request += `or[][status.name]=OPEN&or[][status.name]=IN PROGRESS`;
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
    this._request += `${this.opts()}[organiser]=${this._user.id}`;
  }

  public addIsParticipant(): void {
    this.appendSeparator();
    this._request += `${this.opts()}[participants]=${this._user.id}`;
  }
  
  public addNotParticipant(): void {
    this.appendSeparator();
    this._request += `notParticipant=${this._user.id}`; // Cette instruction ne fonctionne pas.
  }
  
  public addPast(): void {
    this.appendSeparator();
    this._request += `or[][status.name]=PAST`;
  }

  public get request(): string {
    console.log(this._request)
    return this._request;
  }
}