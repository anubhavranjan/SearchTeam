import React from "react";
import {
  Avatar,
  Card,
  Flex,
  Skeleton,
  Text,
  Button,
} from "@fluentui/react-northstar";
import Team from "../../models/Team";
import { useState } from "react";
import { useGraph } from "./lib/useGraph";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { IdentityType, TeamsUserCredential } from "@microsoft/teamsfx";
import { useData } from "./lib/useData";

import {
  TeamsFx,
  createMicrosoftGraphClient,
  ErrorWithCode,
  createApiClient,
  BearerTokenAuthProvider,
} from "@microsoft/teamsfx";
import { Client, GraphError } from "@microsoft/microsoft-graph-client";
export function TeamCard(props: { loading: boolean; data?: Team }) {
  const [joining, setJoining] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");
  const [joined, setJoined] = useState(props.data?.joined || false);
  const JoinTeam = async (
    e: React.SyntheticEvent,
    teamId: string | undefined
  ) => {
    e.preventDefault();
    setJoining(true);
    console.log(teamId);
    if (teamId !== undefined) {
      try {
        const scope = [
          "User.Read",
          "User.Read.All",
          "Group.Read.All",
          //"TeamMember.ReadWrite.All"
        ];
        let teamsfx = new TeamsFx();
        let graph = createMicrosoftGraphClient(teamsfx, scope);

        const profile = await graph.api("/me").get();

        let functionName = "addTeamMember";
        teamsfx = new TeamsFx();
        const credential = teamsfx.getCredential();
        const apiBaseUrl = teamsfx.getConfig("apiEndpoint") + "/api/";
        // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
        const apiClient = createApiClient(
          apiBaseUrl,
          new BearerTokenAuthProvider(
            async () => (await credential.getToken(""))!.token
          )
        );
        const response = await await apiClient.get(functionName, {
          params: { teamId: teamId },
        });
        if (
          response &&
          response.data &&
          response.data.status === 200 &&
          response.data.userId === profile.id
        ) {
          setJoined(true);
        }
      } catch (err: unknown) {
        console.log(err);
        if (
          err instanceof GraphError &&
          err.code?.includes("UiRequiredError")
        ) {
          // Silently fail for user didn't login error
        } else {
          throw err;
        }
      } finally {
        setJoining(false);
      }
    }
  };

  return (
    <Card
      key={
        !props.loading && props.data
          ? props.data.teamID
          : Math.random() * new Date().getMilliseconds()
      }
      aria-roledescription="card avatar"
      elevated
      inverted
      styles={{
        height: "272px",
        margin: "0.5em",
        width: "280px",
        background: "#faf9f8",
      }}
    >
      <Card.Header className="center" styles={{ "margin-bottom": "0" }}>
        {props.loading && (
          <Skeleton animation="wave">
            <Skeleton.Avatar size="larger" />
          </Skeleton>
        )}
        {!props.loading && props.data && (
          // <Flex gap="gap.medium">
          <div style={{ marginTop: "1.5rem" }}>
            <Avatar
              size="larger"
              image={props.data.picture}
              name={props.data.displayName}
              square
            />{" "}
          </div>
        )}
      </Card.Header>
      <Card.Body className="center" style={{ marginTop: "1.5rem" }}>
        {props.loading && (
          <Skeleton animation="wave">
            <div>
              <Skeleton.Line />
              <Skeleton.Line style={{ marginTop: "0.2rem" }} />
              <Skeleton.Line style={{ marginTop: "1.5rem" }} />
            </div>
          </Skeleton>
        )}
        {!props.loading && props.data && (
          <div>
            <Text content={props.data.displayName} weight="bold" />
            <br />
            <Text
              content={props.data.visibility}
              style={{ marginTop: "0.2rem" }}
            />
            {/* <br /> */}
            <hr
              style={{
                display: "block",
                position: "relative",
                width: "80%",
                padding: "0",
                margin: "0.6rem 2rem 0.8rem",
                maxHeight: "0",
                fontSize: "1px",
                lineHeight: "0",
                clear: "both",
                border: "none",
                borderTop: "1px solid rgba(235,235,235,.1)",
              }}
            />
            <Text content={props.data.description} />
          </div>
        )}
      </Card.Body>
      <Card.Footer className="center">
        {props.loading && (
          <Skeleton animation="wave">
            <div>
              <Skeleton.Button />
            </div>
          </Skeleton>
        )}
        {!props.loading && props.data && (
          <div>
            <Button
              secondary
              content={joined ? "Joined" : "Join team"}
              loading={joining}
              disabled={joining || joined}
              onClick={(e) => {
                JoinTeam(e, props.data?.teamID);
              }}
            />
          </div>
        )}
      </Card.Footer>
    </Card>
  );
}

function asyncFunc(graph: Client, teamsfx: TeamsFx, scope: string[]): any {
  throw new Error("Function not implemented.");
}
