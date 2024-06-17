//DTO relativo ai dati di un utente (LATO ADMIN)

export interface UserSearch{
  profilePic: number[];
  username: string;
  follower: boolean;
  friend: boolean
}
