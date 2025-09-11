import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <Error statusCode={props.statusCode} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
CustomErrorComponent.getInitialProps = async (contextData: any) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
