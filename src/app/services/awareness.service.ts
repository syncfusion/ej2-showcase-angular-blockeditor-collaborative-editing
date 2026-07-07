import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketProvider } from 'y-websocket';
import { UserModel } from '../models/user.model';
import { AwarenessState } from '../models/collaboration.model';

@Injectable({
  providedIn: 'root'
})
export class AwarenessService {
  private collaboratorsSubject = new BehaviorSubject<UserModel[]>([]);
  public collaborators$: Observable<UserModel[]> = this.collaboratorsSubject.asObservable();

  private awareness: any = null;

  initialize(provider: WebsocketProvider | null, currentUser: UserModel): void {
    if (!provider) return;

    this.awareness = provider.awareness;

    const user: UserModel = {
      id: currentUser.id,
      user: currentUser.user,
      avatarBgColor: currentUser.avatarBgColor,
    };

    // Set local awareness state
    this.awareness.setLocalState({ user });

    // Handle awareness changes
    const handleChange = () => {
      const states = this.awareness.getStates() as Map<number, AwarenessState>;
      const collaboratorList: UserModel[] = [];

      states.forEach((state: AwarenessState) => {
        if (state?.user && state.user.id !== currentUser.id) {
          collaboratorList.push(state.user);
        }
      });

      this.collaboratorsSubject.next(collaboratorList);
    };

    this.awareness.on('change', handleChange);

    // Initial call
    handleChange();
  }

  updateAwareness(state: any): void {
    if (this.awareness) {
      this.awareness.setLocalState(state);
    }
  }

  cleanup(): void {
    if (this.awareness) {
      this.awareness.destroy();
    }
  }
}
