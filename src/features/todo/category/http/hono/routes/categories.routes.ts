import type { AppContainer } from "@app/container";

import { categoryPresenter } from "../category.presenter";
import { createCategoryRoute } from "./create-category.route";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AuthVariables } from "@/app/http/hono/middlewares/fake-auth.middleware";

type RegisterCategoryRoutesDeps = {
  app: OpenAPIHono<{
    Variables: AuthVariables;
  }>;
  container: AppContainer;
};

export const registerCategoryRoutes = ({
  app,
  container,
}: RegisterCategoryRoutesDeps) => {
  app.openapi(createCategoryRoute, async (context) => {
    const auth = context.get("auth");
    const body = context.req.valid("json");

    const category = await container.categoryUseCases.createCategory({
      userId: auth.userId,
      name: body.name,
    });

    return context.json(categoryPresenter.toHttp(category), 201);
  });
};
