import { Fragment, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "../Loading";

const RedirectComp = ({url}: {url : string}) => {
    useEffect(() => {
        const redirect = async () => await fetch(`${import.meta.env.PUBLIC_API}/${url}`)
        redirect()
      }, [])
      return <Fragment/>
}

export const Redirect = ({url}: {url : string}) => {

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<Loading />}>
            <RedirectComp url={url} />
        </Suspense>                            
    </ErrorBoundary>
  );
};
