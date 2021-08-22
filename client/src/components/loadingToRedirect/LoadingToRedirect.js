import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./loadingToRedirect.scss";

function LoadingToRedirect() {
  const [count, setCount] = useState(5);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => --c);
    }, 1000);

    count === 0 && history.push("/login");

    return () => {
      clearInterval(interval);
    };
  }, [count, history]);

  return (
    <>
      <div className="redirectContainer">
        <div>
          Redirecting you in <span>{count}</span> seconds.
        </div>
      </div>
    </>
  );
}

export default LoadingToRedirect;
