import "./Graph.css";
import { useGraph } from "./lib/useGraph";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { Button, Input } from "@fluentui/react-northstar";
import { Design } from "./Design";
import { PersonCardFluentUI } from "./PersonCardFluentUI";
import { TeamCardFluentUI } from "./TeamCardFluentUI";
import { PersonCardGraphToolkit } from "./PersonCardGraphToolkit";
import Team from "../../models/Team";
import { useState } from "react";
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";

export function Graph() {
  const [query, setQuery] = useState<String>();
  const [userTeams, setUserTeams] = useState<Array<String>>([]);

  const { loading, error, data, reload } = useGraph(
    async (graph, teamsfx, scope) => {
      // Call graph api directly to get user profile information
      const profile = await graph.api("/me").get();
      const userTeams = await graph.api("/me/joinedTeams").get();
      let joinedTeams = [];

      if (userTeams !== undefined && userTeams.value !== undefined) {
        for (let i = 0; i < userTeams.value.length; i++) {
          joinedTeams.push(userTeams.value[i].id);
        }
      }

      let teams: any = undefined;
      if (query !== "") {
        teams = await graph
          .api(
            "/groups?$top=999&$filter=resourceProvisioningOptions%2fAny(x%3ax+eq+%27Team%27)&$search=%22displayName%3a" +
              query +
              "%22"
          )
          .header("ConsistencyLevel", "eventual")
          .get();
      }
      let resultTeams = [];
      if (teams && teams.value)
        for (let i = 0; i < teams.value.length; i++) {
          if (
            teams.value[i].visibility === "Public" &&
            !joinedTeams.includes(teams.value[i].id)
          ) {
            let teamPhoto = await graph
              .api("/groups/" + teams.value[i].id + "/photos/96x96/$value")
              .get();
            let teamPhotoUrl = URL.createObjectURL(teamPhoto);
            let team = new Team(
              teams.value[i].id,
              teams.value[i].displayName,
              teams.value[i].description,
              teams.value[i].mail,
              teams.value[i].visibility,
              teamPhotoUrl,
              joinedTeams.includes(teams.value[i].id)
            );
            resultTeams.push(team);
          }
        }

      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);

      let photoUrl = "";
      try {
        const photo = await graph.api("/me/photo/$value").get();
        photoUrl = URL.createObjectURL(photo);
      } catch {
        // Could not fetch photo from user's profile, return empty string as placeholder.
      }
      return { profile, photoUrl, joinedTeams, resultTeams };
    },
    {
      scope: ["User.Read", "User.Read.All", "Group.Read.All"],
    }
  );

  return (
    <div className="center">
      {/* <Design /> */}
      <div>Enter your search term and Click Search</div>
      <div>
        <Input
          type="text"
          placeholder="Search..."
          onChange={async (e, v) => await setQuery(v?.value)}
        />
        <Button primary content="Search" disabled={loading} onClick={reload} />

        <h4>Search Result(s)</h4>
        <TeamCardFluentUI loading={loading} data={data} error={error} />
      </div>
    </div>
  );
}
