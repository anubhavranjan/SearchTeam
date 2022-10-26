# SearchTeam
Search for Join Teams (Proof of Concept)

## This App is divided into two parts:
1. [Personal Tab](https://github.com/anubhavranjan/SearchTeam/tree/main/tabs)
2. [Azure Function](https://github.com/anubhavranjan/SearchTeam/tree/main/api)

We make use of the Personal Tab and extend it to make use of the Graph API, Teams SSO and Azure Function Backend.
With Graph API, and Teams SSO, the App can easily fetch the logged-in user as long as the user has provided the consent.
Once the App fetches the Logged-in user, it can easily perform the Search for the Teams using Graph API.

Using Graph Explorer, one can perform this request to search for a specific team in Teams.

Graph URL: [https://graph.microsoft.com/v1.0/groups?$top=999&$filter=resourceProvisioningOptions/Any(x:x+eq+'Team')&$search="displayName:Test"](https://graph.microsoft.com/v1.0/groups?$top=999&$filter=resourceProvisioningOptions/Any(x:x+eq+'Team')&$search="displayName:Test")

 - Using $top for max page items
 - $filter for filter criteria
 - $search for Searching based on DisplayName
 
 
Once the results are available, they are further filtered matching the criteria like Visibility.

To get the users to join the Team, we make use of the Azure Function.
In this, we post content in the format:

```
{
  "@odata.type": "#microsoft.graph.aadUserConversationMember",
  roles: [],
  "user@odata.bind":
  "https://graph.microsoft.com/v1.0/users('" + currentUser.objectId + "')", // User ID
};
```

Graph URL: https://graph.microsoft.com/v1.0/teams/{teamId}/members

