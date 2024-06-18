//DTO relativo ai dati di un utente (LATO USER)

export interface UserSearch{
  profilePic: number[];
  username: string;
  follower: boolean;
  friend: boolean
}
