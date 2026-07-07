import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { getOrCreateRoomId, getRoomIdFromHash, setRoomIdInHash } from '../utils/room-id-generator';

@Injectable({
  providedIn: 'root'
})
export class RoomIdService {
  private roomIdSubject: BehaviorSubject<string>;
  public roomId$: Observable<string>;

  constructor() {
    const initialRoomId = getOrCreateRoomId();
    this.roomIdSubject = new BehaviorSubject<string>(initialRoomId);
    this.roomId$ = this.roomIdSubject.asObservable();

    // Listen for hash changes
    fromEvent(window, 'hashchange').subscribe(() => {
      const hashRoomId = getRoomIdFromHash();
      if (hashRoomId && hashRoomId !== this.roomIdSubject.value) {
        this.roomIdSubject.next(hashRoomId);
      }
    });
  }

  get roomId(): string {
    return this.roomIdSubject.value;
  }

  setRoomId(newRoomId: string): void {
    this.roomIdSubject.next(newRoomId);
    setRoomIdInHash(newRoomId);
  }
}
