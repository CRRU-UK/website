import type { GetServerSidePropsContext } from "next";

import { COMMON_CACHE_DIRECTIVES } from "@/helpers/constants";

const setPageCacheHeaders = (ctx: GetServerSidePropsContext): void => {
  if (process.env.NODE_ENV === "production") {
    ctx.res.setHeader("Cache-Control", COMMON_CACHE_DIRECTIVES);
  }
};

export { setPageCacheHeaders };
