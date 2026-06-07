import type { AppContainer } from "@app/container";

import { categoryPresenter } from "../presenters/category.presenter";
import { createCategoryRoute } from "./create-category/create-category.route";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AuthVariables } from "/auth/infra/better-auth/better-auth.middleware";
import { listCategoriesRoute } from "./list-categories/list-categories.route";
import { getCategoryRoute } from "./get-category/get-category.route";
import { updateCategoryRoute } from "./update-category/update-category.route";
import { categoryMutationPresenter } from "../presenters/category-mutation.presenter";
import { deleteCategoryRoute } from "./delete-category/delete-category.route";

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
    const user = context.get("user");
    const body = context.req.valid("json");

    const category = await container.categoryUseCases.createCategory({
      userId: user.id,
      name: body.name,
    });

    return context.json(categoryPresenter.toHttp(category), 201);
  });

  app.openapi(listCategoriesRoute, async (context) => {
    const user = context.get("user");
    const query = context.req.valid("query");

    const categories = await container.categoryUseCases.listCategories({
      userId: user.id,
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
    const user = context.get("user");
    const params = context.req.valid("param");

    const category = await container.categoryUseCases.getCategory({
      id: params.id,
      userId: user.id,
    });

    return context.json(categoryPresenter.toHttp(category), 200);
  });

  app.openapi(updateCategoryRoute, async (context) => {
    const user = context.get("user");
    const params = context.req.valid("param");
    const body = context.req.valid("json");

    const result = await container.categoryUseCases.updateCategory({
      id: params.id,
      userId: user.id,
      name: body.name,
    });

    return context.json(categoryMutationPresenter.toHttp(result), 200);
  });

  app.openapi(deleteCategoryRoute, async (context) => {
    const user = context.get("user");
    const params = context.req.valid("param");

    await container.categoryUseCases.deleteCategory({
      id: params.id,
      userId: user.id,
    });

    return context.body(null, 204);
  });
};
