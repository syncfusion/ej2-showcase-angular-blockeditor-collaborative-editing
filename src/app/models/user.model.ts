export interface UserModel {
  id: string;
  user: string;
  avatarBgColor: string;
}

export interface CursorColor {
  /** Semi-transparent fill used for selection highlights */
  light: string;
  /** Solid colour used for the caret line and name label */
  dark: string;
}
