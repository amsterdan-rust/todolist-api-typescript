import type { AppContainer } from "@app/container";

import { categoryPresenter } from "../category.presenter";
import { createCategoryRoute } from "./create-category.route";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AuthVariables } from "@/app/http/hono/middlewares/fake-auth.middleware";
import { listCategoriesRoute } from "./list-categories.route";
import { getCategoryRoute } from "./get-category.route";
import { updateCategoryRoute } from "./update-category.route";
import { categoryMutationPresenter } from "../category-mutation.presenter";

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

  app.openapi(listCategoriesRoute, async (context) => {
    const auth = context.get("auth");
    const query = context.req.valid("query");

    const categories = await container.categoryUseCases.listCategories({
      userId: auth.userId,
      ...(query.name !== undefined && { name: query.name }),
    });

    return context.json(
      {
        categories: categories.map(categoryPresenter.toHttp),
      },
      200,
    );
  });

  app.openapi(getCategoryRoute, async (context) => {
    const auth = context.get("auth");
    const params = context.req.valid("param");

    const category = await container.categoryUseCases.getCategory({
      id: params.id,
      userId: auth.userId,
    });

    return context.json(categoryPresenter.toHttp(category), 200);
  });

  app.openapi(updateCategoryRoute, async (context) => {
    const auth = context.get("auth");
    const params = context.req.valid("param");
    const body = context.req.valid("json");

    const result = await container.categoryUseCases.updateCategory({
      id: params.id,
      userId: auth.userId,
      name: body.name,
    });

    return context.json(categoryMutationPresenter.toHttp(result), 200);
  });
};
