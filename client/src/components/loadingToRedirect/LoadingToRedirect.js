import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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

  return <div>Redirecting you in {count} seconds.</div>;
}

export default LoadingToRedirect;
