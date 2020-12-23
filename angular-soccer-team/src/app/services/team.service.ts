import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';
export const TeamsTableHeaders = ['Name', 'Country', 'Players'];

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private teamDb: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamDb = this.db.list('/teams', (ref) => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map(
          (c) =>
            ({
              $key: c.payload.key,
              ...c.payload.val(),
            } as Team)
        );
      })
    );
  }

  addTeam(team: Team) {
    return this.teamDb.push(team);
  }

  deleteTeam(id: string) {
    this.db.list('/teams').remove(id);
  }

  editTeam(newTeamData: any) {
    const $key = newTeamData.$key;
    // Firebase no acepta la existencia de un key
    delete newTeamData.$key;
    this.db.list('/players').update($key, newTeamData);
  }
}
