class Team {
  teamID?: string;
  displayName?: string;
  description?: string;
  email?: string;
  visibility?: string;
  picture?: string;
  joined?: boolean;

  constructor(
    teamID?: string,
    displayName?: string,
    description?: string,
    email?: string,
    visibility?: string,
    picture?: string,
    joined?: boolean
  ) {
    this.teamID = teamID;
    this.email = email;
    this.displayName = displayName;
    this.description = description;
    this.picture = picture;
    this.visibility = visibility;
    this.joined = joined;
  }
}

export default Team;
