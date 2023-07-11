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
  organiser?: boolean | undefined,
  participant?: boolean | undefined,
  notParticipant?: boolean | undefined,
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
    inst.includePastEvents && this.erb.addPast();
    inst.organiser && this.erb.addIsOrganiser();
    if (XOR(inst.participant, inst.notParticipant)) {
      inst.participant && this.erb.addIsParticipant();
      inst.notParticipant && this.erb.addNotParticipant();
    }
    if (inst.organiser || XOR(inst.participant, inst.notParticipant)) {
      this.erb.addUserFilters();
    }
    return this.erb.request;
  }
}

function XOR(a: any, b: any) {
  return (a && !b) || (!a && b);
}

export class EventRequestBuilder {
  
  private _request!: string;
  private _user: User = JSON.parse(sessionStorage.getItem("user")!);
  private _userFilter: any[] = [this._user.id]

  public constructor() {
    this.reset();
  }

  public reset() {
    this._request = process.env.NEXT_PUBLIC_SERVER_URL!+'events.json?';
    this._userFilter = [this._user.id];
  }

  private appendSeparator() {
    if (!this._request.endsWith('?')) { this._request += '&'; }
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

  public addIsOrganiser(): void {
    this._userFilter.push("organiser")
  }

  public addIsParticipant(): void {
    this._userFilter.push("isParticipant")
  }
  
  public addNotParticipant(): void {
    this._userFilter.push("notParticipant")
  }

  public addUserFilters(): void {
    this.appendSeparator();
    this._request += "and[whereUser]="+JSON.stringify(this._userFilter);
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