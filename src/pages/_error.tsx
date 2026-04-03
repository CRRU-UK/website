import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <NextError statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (
  contextData: Parameters<typeof NextError.getInitialProps>[0],
) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return NextError.getInitialProps(contextData);
};

export default CustomErrorComponent;
