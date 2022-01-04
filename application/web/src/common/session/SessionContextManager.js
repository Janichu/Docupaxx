import React, { useEffect, useState } from "react";
import { request } from "../../util/request";

export const SessionContext = React.createContext(null);

export const SessionContextManager = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      request(`/sessions`)
        .then((sessions) => {
          // alert("Success: " + JSON.stringify(sessions));
          const session = sessions[0];
          setSession(session);
          setLoaded(true);
        })
        .catch((error) => "Error: " + JSON.stringify(error));
    }
  }, [loaded]);

  console.log(session, "session");
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
