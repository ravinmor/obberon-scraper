import { Router } from "express";
import { PermissionController } from "./controllers/PermissionController";
import { RoleController } from "./controllers/RoleController";
import { RolePermissionController } from "./controllers/RolePermissionController";
import { UserAccessControlListController } from "./controllers/UserAccessControlListController";
import { UserController } from "./controllers/UserController";
import { SessionController } from "./controllers/SessionController";
import { ensuredAuthenticated } from "./middleware/ensuredAuthenticated";
import { NewsController } from "./controllers/NewsController";
import { NewsScraperController } from "./controllers/NewsScraperController";
import { OpenAiController } from "./controllers/OpenAiController";

const routes = Router();

routes.get("/user/:id", ensuredAuthenticated(), new UserController().index);
routes.get("/getUserByEmail", ensuredAuthenticated(),  new UserController().getUserByEmail);
routes.post("/createUser", ensuredAuthenticated(),  new UserController().createUser);
routes.put("/updateUser/:id", ensuredAuthenticated(),  new UserController().updateUser);
routes.delete("/deleteUser/:id", ensuredAuthenticated(),  new UserController().deleteUser);

routes.post("/login", new SessionController().handle);

routes.post(
  "/roles",
  ensuredAuthenticated(),
  new RoleController().createRole
);

routes.post(
  "/permissions",
  ensuredAuthenticated(),
  new PermissionController().createPermission
);

routes.post(
  "/users/acl",
  ensuredAuthenticated(),
  new UserAccessControlListController().addRolesAndPermissions
);

routes.post("/roles/:roleId", new RolePermissionController().getRoleById);


routes.get("/getLastNewsEstadao", new NewsController().getLastNewsEstadao);
routes.get("/getLastNewsG1", new NewsController().getLastNewsG1);
routes.get("/getLastNewsValorEconomico", new NewsController().getLastNewsValorEconomico);
routes.get("/getLastNewsRevistaOeste", new NewsController().getLastNewsRevistaOeste);
routes.get("/getLastNewsJovemPan", new NewsController().getLastNewsJovemPan);

routes.get("/scrapNewsEstadao", new NewsScraperController().scrapNewsEstadao);
routes.get("/scrapNewsG1", new NewsScraperController().scrapNewsG1);
routes.get("/scrapNewsValorEconomico", new NewsScraperController().scrapNewsValorEconomico);
routes.get("/scrapNewsRevistaOeste", new NewsScraperController().scrapNewsRevistaOeste);
routes.get("/scrapNewsJovemPan", new NewsScraperController().scrapNewsJovemPan);

routes.get("/scrapNewsListEstadao", new NewsScraperController().scrapNewsListEstadao);
routes.get("/scrapNewsListG1", new NewsScraperController().scrapNewsListG1);
routes.get("/scrapNewsListValorEconomico", new NewsScraperController().scrapNewsListValorEconomico);
routes.get("/scrapNewsListRevistaOeste", new NewsScraperController().scrapNewsListRevistaOeste);
routes.get("/scrapNewsListJovemPan", new NewsScraperController().scrapNewsListJovemPan);

routes.get("/resumeNews", new OpenAiController().resumeNews)
routes.get("/returnTokensAmountOfAText", new OpenAiController().returnTokensAmountOfAText)

export { routes };
