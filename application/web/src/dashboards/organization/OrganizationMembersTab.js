import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Header, Input } from "semantic-ui-react";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { USER_MODEL, UsersTab } from "../../common/dashboard/dataitem/user/UsersTab";
import { request } from "../../util/request";

/**
 * ORGANIZATION_MEMBER_MODEL
 */
const ORGANIZATION_MEMBER_MODEL = DataItemModel({
    ...USER_MODEL,
    dashboardToken: "organizations",
    section: "members",
    add: true,
    addText: "Invite Member",
    remove: true,
    removalText: "Remove Member",
    noSearch: true,
    getTitle: (user) => user.email,
    getDescription: (user) => (user.is_enabled ? "Enabled": "Not Invited")
    // filterDataItems: (users, viewerId) => users.filter((user) => (user.type == "orgMember" && user.organizationId == viewerId))
})



/**
 * OrganizationMembersTab
 */
export const OrganizationMembersTab = () => {
    const { id } = useParams()
    return (
        <UsersTab
            viewerId={id}
            dataModel={ORGANIZATION_MEMBER_MODEL}
        />
    )
}


export const OrganizationInviteMembersTab = () => {
    const { id } = useParams()
    const [email, setEmail] = useState("")
    return (
        <>
            <Header icon="users" content="Enter the New Member's Email" />
            <Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Enter the member's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => setEnabled(email)}>Invite Member</Button>
      </>
    )
}

const setEnabled = (email) => {
    request(`/users/enable`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email
        }),
    })
}