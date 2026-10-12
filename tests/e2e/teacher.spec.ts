import { test, expect, type Page } from "@playwright/test";
async function login(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Entrar al entorno de prueba" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hola, profe" }),
  ).toBeVisible();
}
async function createService(page: Page, name: string) {
  await page.goto("/servicios/nuevo");
  await page.getByLabel("Nombre del servicio", { exact: true }).fill(name);
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Confianza, técnica y musicalidad.");
  await page.getByLabel("Tipo de seguimiento").selectOption("proceso");
  await page.getByLabel("Precio (S/)").fill("180");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page
    .getByRole("link", { name: new RegExp(name) })
    .last()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(name);
}
test("teacher completes the full planning and attendance workflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  await createService(page, "Heels mensual");
  const serviceUrl = page.url();
  await page.getByRole("link", { name: "Nuevo ciclo", exact: true }).click();
  await page.getByLabel("Nombre del ciclo").fill("Octubre · Diana");
  await page.getByLabel("Objetivos del ciclo").fill("Bailar con confianza");
  await page
    .getByRole("button", { name: "Agregar alumna", exact: true })
    .click();
  await page.getByLabel("Nombre de alumna", { exact: true }).fill("Diana");
  await page
    .getByLabel("Criterios de seguimiento")
    .fill("Musicalidad\nConfianza");
  await page.getByRole("button", { name: "Agregar bloque" }).click();
  await page.getByLabel("Nombre del bloque 1").fill("Activación");
  await page.getByLabel("Minutos", { exact: true }).fill("15");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Octubre · Diana/ }).click();
  const cycleUrl = page.url();
  await expect(page.getByText("Sin clases dadas")).toBeVisible();
  await page.getByRole("link", { name: "Nueva clase", exact: true }).click();
  await page.getByLabel("Tema de la clase").fill("Confianza en movimiento");
  await expect(page.getByLabel("Nombre del bloque 1")).toHaveValue(
    "Activación",
  );
  await expect(page.getByLabel("Alumna de clase 1")).toHaveValue("Diana");
  await page.getByLabel("Presente Diana", { exact: true }).check();
  await page.getByLabel("Cómo llegas").selectOption("Inspirada");
  await page.getByLabel("Cómo te vas").selectOption("En calma");
  await page
    .getByLabel("Notas del profesor")
    .fill("Una clase llena de conexión.");
  await page.getByLabel("Clase realizada", { exact: true }).check();
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Confianza en movimiento/ }).click();
  const classUrl = page.url();
  await expect(page.getByText("Inspirada", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Confianza en movimiento", exact: true }),
  ).toBeVisible();
  await page.goto(cycleUrl);
  await expect(page.getByText("100% asistencia")).toBeVisible();
  await expect(page.getByText("1 de 1 clases dadas")).toBeVisible();
  await page.goto(serviceUrl);
  await page.getByRole("link", { name: "Nuevo proceso", exact: true }).click();
  await page.getByLabel("Nombre del proceso").fill("Coreografía · Octubre");
  await page.getByLabel("Estilo", { exact: true }).fill("Heels");
  await page.getByRole("button", { name: "Lun", exact: true }).click();
  await page.getByRole("button", { name: "Agregar sección" }).click();
  await page.getByLabel("Sección 1", { exact: true }).fill("Intro");
  await page.getByRole("button", { name: "Agregar sección" }).click();
  await page.getByLabel("Sección 2", { exact: true }).fill("Coro");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Coreografía · Octubre/ }).click();
  await page.getByLabel("Intro", { exact: true }).click();
  await expect(page.getByLabel("Intro", { exact: true })).toBeChecked();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await page.goto(classUrl);
  await page.getByRole("button", { name: "Marcar como pendiente" }).click();
  await expect(
    page.getByRole("button", { name: "Marcar como dada" }),
  ).toBeVisible();
  await page.goto(cycleUrl);
  await expect(page.getByText("Sin clases dadas")).toBeVisible();
  await page.goto(serviceUrl);
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hay registros vinculados" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Hola, profe" }),
  ).toBeVisible();
  await expect(page.getByText("01", { exact: true })).toHaveCount(3);
  await createService(page, "Sesión privada");
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Tipo de seguimiento").selectOption("por_clase");
  await page.getByLabel("Precio (S/)").fill("80");
  await page
    .getByRole("button", { name: "Color #4D8FFF", exact: true })
    .click();
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Sesión privada",
  );
  await createService(page, "Workshop · Flow");
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Tipo de seguimiento").selectOption("ninguno");
  await page.getByLabel("Precio (S/)").fill("50");
  await page
    .getByRole("button", { name: "Color #00C9B1", exact: true })
    .click();
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Workshop · Flow",
  );
  await page.goto("/clases/nueva");
  await page.getByLabel("Tema de la clase").fill("Explora tu propio ritmo");
  await page.getByLabel("Género / estilo").fill("Contemporáneo");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page).toHaveURL(/\/clases$/);
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Explora tu propio ritmo/ }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("edits and removes records without leaving linked children", async ({
  page,
}) => {
  await login(page);
  await createService(page, "Servicio inicial");
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page
    .getByLabel("Nombre del servicio", { exact: true })
    .fill("Servicio actualizado");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Servicio actualizado",
  );
  const serviceUrl = page.url();
  await page.getByRole("link", { name: "Nuevo ciclo", exact: true }).click();
  await page.getByLabel("Nombre del ciclo").fill("Ciclo temporal");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Ciclo temporal/ }).click();
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Nombre del ciclo").fill("Ciclo corregido");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ciclo corregido",
  );
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar eliminación" }).click();
  await expect(page.getByRole("link", { name: /Ciclo corregido/ })).toHaveCount(
    0,
  );
  await page.getByRole("link", { name: "Nuevo proceso", exact: true }).click();
  await page.getByLabel("Nombre del proceso").fill("Proceso temporal");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Proceso temporal/ }).click();
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Nombre del proceso").fill("Proceso corregido");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar eliminación" }).click();
  await expect(
    page.getByRole("link", { name: /Proceso corregido/ }),
  ).toHaveCount(0);
  await page.goto(serviceUrl);
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar eliminación" }).click();
  await expect(
    page.getByRole("link", { name: /Servicio actualizado/ }),
  ).toHaveCount(0);
  await page.goto("/clases/nueva");
  await page.getByLabel("Tema de la clase").fill("Clase temporal");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Clase temporal/ }).click();
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Tema de la clase").fill("Clase corregida");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar eliminación" }).click();
  await expect(page.getByRole("link", { name: /Clase corregida/ })).toHaveCount(
    0,
  );
});
test("375px and 390px layouts keep navigation and editors inside the viewport", async ({
  page,
}) => {
  await login(page);
  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Navegación móvil" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.goto("/clases/nueva");
    await page.getByRole("button", { name: "Agregar bloque" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("link", { name: "Volver", exact: true }).click();
    await page.getByRole("button", { name: "Descartar y salir" }).click();
  }
});
test("failed saves retain edits and account switching clears private records", async ({
  page,
  context,
}) => {
  await login(page);
  await page.goto("/clases/nueva");
  await page.getByLabel("Tema de la clase").fill("Clase libre");
  await context.setOffline(true);
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("alert")).toContainText("Necesitas conexión");
  await expect(page.getByLabel("Tema de la clase")).toHaveValue("Clase libre");
  await context.setOffline(false);
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("link", { name: /Clase libre/ }).click();
  await page.getByRole("button", { name: "Marcar como dada" }).click();
  await page.goto("/");
  await page.getByRole("button", { name: "dadas", exact: true }).click();
  await expect(page.getByRole("link", { name: /Clase libre/ })).toBeVisible();
  await page.getByRole("button", { name: "pendientes", exact: true }).click();
  await expect(page.getByRole("link", { name: /Clase libre/ })).toHaveCount(0);
  if (await page.getByRole("button", { name: "Abrir menú" }).isVisible())
    await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Entrar al entorno de prueba" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hola, profe" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Clase libre/ })).toHaveCount(0);
});
test("dirty forms warn on internal navigation and itineraries reject overflow", async ({
  page,
}) => {
  await login(page);
  await page.goto("/clases/nueva");
  await page.getByLabel("Tema de la clase").fill("Borrador");
  await page.getByRole("button", { name: "Agregar bloque" }).click();
  await page.getByLabel("Nombre del bloque 1").fill("Demasiado largo");
  await page.getByLabel("Minutos", { exact: true }).fill("90");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("alert")).toContainText("ajusta sus minutos");
  await page.getByRole("link", { name: "Volver", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Seguir editando" }).click();
  await expect(page.getByLabel("Tema de la clase")).toHaveValue("Borrador");
  await page.getByRole("link", { name: "Volver", exact: true }).click();
  await page.getByRole("button", { name: "Descartar y salir" }).click();
  await expect(page.getByRole("heading", { name: "Mis clases" })).toBeVisible();
});
