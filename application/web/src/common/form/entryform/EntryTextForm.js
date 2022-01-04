import { EntryBox } from "./EntryBox";

/**
 * EntryTextForm
 */
export const EntryTextForm = ({ children, title, headerMessageTitle, headerMessageDescription, onSubmit, submitButtonText, footerChildren }) => {
    return (
        <EntryBox
            title={title}
            marginLeft="30vw"
            maxWidth="40vw"
            headerMessageTitle={headerMessageTitle}
            headerMessageDescription={headerMessageDescription}
            onSubmit={onSubmit}
            submitButtonText={submitButtonText}
            footerChildren={footerChildren}
        >
            
                {children}
            
        </EntryBox>
    )
}
