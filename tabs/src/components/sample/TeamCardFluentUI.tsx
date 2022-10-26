import Team from "../../models/Team";
import { TeamCard } from "./TeamCard";
import { Flex, Grid, Loader } from "@fluentui/react-northstar";

export function TeamCardFluentUI(props: {
  loading?: boolean;
  error?: any;
  data?:
    | {
        profile: any;
        photoUrl: string;
        joinedTeams: string[];
        resultTeams: Team[];
      }
    | undefined;
}) {
  let teams: JSX.Element[] = [];
  if (!props.loading && props.data && props.data.resultTeams) {
    teams = props.data.resultTeams.map((team) => {
      return <TeamCard key={team.teamID} loading={false} data={team} />;
    });
  }
  return (
    <div className="section-margin">
      {props.loading && (
        <>
          <Loader label="Loading..." />
          {<TeamCard loading={true} data={undefined} />}
        </>
      )}
      {!props.loading && props.error && (
        <div className="error">
          Failed to read your profile. Please try again later. <br /> Details:{" "}
          {props.error.toString()}
        </div>
      )}

      {!props.loading && props.data && props.data.resultTeams && (
        <Grid columns={3} content={teams} />
      )}
    </div>
  );
}
