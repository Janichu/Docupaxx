import { useEffect } from "react"
import { useParams } from "react-router"
import { Segment } from "semantic-ui-react"
import { DocupaxxPage } from "../common/DocupaxxPage"
import { request } from "../util/request"

export const VerificationPage = () => {
    const { id } = useParams()
    useEffect(() => verify(id), [id])
    return (
        <DocupaxxPage>
            <Segment>
                By coming here this means that you are verified!  Feel free to login!
            </Segment>
        </DocupaxxPage>
    )
}

const verify = (id) => {
    request("/users/enable", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id
        }),
    })
}