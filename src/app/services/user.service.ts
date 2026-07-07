import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { generateUser } from '../utils/mock-data';

const USER_STORAGE_KEY = 'blockeditor-current-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: UserModel | null = null;

  /**
   * Get current active user
   * - Retrieves from sessionStorage if available
   * - Generates new user if not found
   */
  getCurrentUser(): UserModel {
    if (!this.currentUser) {
      // Try to load from sessionStorage
      const storedUser = this.loadUserFromStorage();
      if (storedUser) {
        this.currentUser = storedUser;
      } else {
        // Generate new user and save to sessionStorage
        this.currentUser = generateUser();
        this.saveUserToStorage(this.currentUser);
      }
    }
    return this.currentUser;
  }

  /**
   * Set current active user
   */
  setCurrentUser(user: UserModel): void {
    this.currentUser = user;
    this.saveUserToStorage(user);
  }

  /**
   * Load user from sessionStorage
   */
  private loadUserFromStorage(): UserModel | null {
    try {
      const storedData = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData) as UserModel;
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
    return null;
  }

  /**
   * Save user to sessionStorage
   */
  private saveUserToStorage(user: UserModel): void {
    try {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }
}
